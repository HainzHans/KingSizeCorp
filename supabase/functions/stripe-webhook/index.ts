const SUPABASE_URL          = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_KEY          = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const STRIPE_WEBHOOK_SECRET = Deno.env.get('STRIPE_WEBHOOK_SECRET')!;
const RESEND_API_KEY        = Deno.env.get('RESEND_API_KEY')!;
const ADMIN_EMAIL           = Deno.env.get('ADMIN_EMAIL')!;
const FROM_EMAIL            = Deno.env.get('FROM_EMAIL')!;
const APP_URL               = Deno.env.get('APP_URL')!;

const REDIRECT_TO = `${APP_URL.replace(/\/$/, '')}/passwort-setzen`;
const LOGIN_URL   = `${APP_URL.replace(/\/$/, '')}/login`;

// ── Supabase REST Helper ─────────────────────────────────────
async function dbUpdate(
  table: string,
  filters: Record<string, string>,
  body: Record<string, unknown>,
  select?: string,
) {
  const params = Object.entries(filters)
    .map(([k, v]) => `${k}=eq.${encodeURIComponent(v)}`)
    .join('&');

  const url = select
    ? `${SUPABASE_URL}/rest/v1/${table}?${params}&select=${select}`
    : `${SUPABASE_URL}/rest/v1/${table}?${params}`;

  const res = await fetch(url, {
    method: 'PATCH',
    headers: {
      'apikey':        SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Content-Type':  'application/json',
      'Prefer':        select ? 'return=representation' : 'return=minimal',
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.json();
    return { data: null, error: err };
  }

  if (select) {
    const data = await res.json();
    return { data: Array.isArray(data) && data.length > 0 ? data[0] : null, error: null };
  }

  return { data: null, error: null };
}

// ── Account: finden oder anlegen ─────────────────────────────
// Gibt die User-ID zurück und ob der Account bereits ein Passwort hat.
// hasPassword=false gilt für frisch angelegte UND für die per Backfill
// erzeugten Bestandskonten – beide sollen den Passwort-setzen-Link bekommen.
async function findOrCreateUser(
  email: string,
  name: string,
  phone: string,
): Promise<{ id: string; hasPassword: boolean } | null> {
  // 1. Vorhandenen Account suchen (security-definer RPC, nur service_role)
  const lookup = await fetch(`${SUPABASE_URL}/rest/v1/rpc/auth_user_by_email`, {
    method:  'POST',
    headers: {
      'apikey':        SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Content-Type':  'application/json',
    },
    body: JSON.stringify({ p_email: email }),
  });

  if (lookup.ok) {
    const rows = await lookup.json();
    if (Array.isArray(rows) && rows.length > 0) {
      return { id: rows[0].id, hasPassword: rows[0].has_password === true };
    }
  } else {
    console.error('auth_user_by_email fehlgeschlagen:', lookup.status);
  }

  // 2. Kein Account vorhanden → über die GoTrue Admin-API anlegen.
  //    email_confirm: true, weil die Adresse über Stripe verifiziert ist.
  //    Kein Passwort – der Kunde setzt es selbst über den Link.
  const create = await fetch(`${SUPABASE_URL}/auth/v1/admin/users`, {
    method:  'POST',
    headers: {
      'apikey':        SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Content-Type':  'application/json',
    },
    body: JSON.stringify({
      email,
      email_confirm: true,
      user_metadata: {
        full_name:      name,
        phone,
        email_verified: true,
        source:         'mentoring_purchase',
      },
    }),
  });

  const created = await create.json();

  if (create.ok) {
    const id = created.id ?? created.user?.id;
    if (id) return { id, hasPassword: false };
    console.error('User angelegt, aber keine ID erhalten:', JSON.stringify(created));
    return null;
  }

  // Race: zwischen Lookup und Create wurde der Account (z. B. durch ein
  // dupliziertes Event) doch angelegt → noch einmal nachschlagen.
  console.error('User anlegen fehlgeschlagen:', JSON.stringify(created));
  const retry = await fetch(`${SUPABASE_URL}/rest/v1/rpc/auth_user_by_email`, {
    method:  'POST',
    headers: {
      'apikey':        SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Content-Type':  'application/json',
    },
    body: JSON.stringify({ p_email: email }),
  });
  if (retry.ok) {
    const rows = await retry.json();
    if (Array.isArray(rows) && rows.length > 0) {
      return { id: rows[0].id, hasPassword: rows[0].has_password === true };
    }
  }
  return null;
}

// ── Recovery-Link (= „Passwort setzen") erzeugen ─────────────
async function generateSetPasswordLink(email: string): Promise<string | null> {
  const res = await fetch(`${SUPABASE_URL}/auth/v1/admin/generate_link`, {
    method:  'POST',
    headers: {
      'apikey':        SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Content-Type':  'application/json',
    },
    body: JSON.stringify({ type: 'recovery', email, redirect_to: REDIRECT_TO }),
  });
  if (!res.ok) {
    console.error('generate_link fehlgeschlagen:', res.status);
    return null;
  }
  const data = await res.json();
  return data.action_link ?? data.properties?.action_link ?? null;
}

// ── Account-Abschnitt für die Bestätigungsmail ───────────────
function accountSection(hasPassword: boolean, setPasswordLink: string | null): string {
  // Bestandskunde mit eigenem Passwort → nur Hinweis auf den Login.
  if (hasPassword) {
    return `
      <div style="background: #eef6ff; border: 1px solid #b6d8ff; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
        <p style="margin: 0 0 8px; font-weight: 600; color: #0f172a;">Dein Mitgliederbereich</p>
        <p style="margin: 0 0 16px; font-size: 14px; color: #475569;">
          Melde dich mit deinem bestehenden Zugang an, um deine Buchung einzusehen.
        </p>
        <a href="${LOGIN_URL}"
           style="display: inline-block; background: #0f172a; color: #fff; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; font-size: 14px;">
          Zum Login →
        </a>
      </div>`;
  }

  // Neuer oder passwortloser Account → Passwort setzen.
  if (setPasswordLink) {
    return `
      <div style="background: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
        <p style="margin: 0 0 8px; font-weight: 600; color: #065f46;">Dein Zugang zum Mitgliederbereich</p>
        <p style="margin: 0 0 16px; font-size: 14px; color: #047857;">
          Wir haben dir automatisch einen Account angelegt. Vergib jetzt dein
          Passwort, dann kannst du dich jederzeit einloggen:
        </p>
        <a href="${setPasswordLink}"
           style="display: inline-block; background: #0f172a; color: #fff; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; font-size: 14px;">
          Passwort setzen →
        </a>
        <p style="margin: 12px 0 0; font-size: 12px; color: #059669;">
          Der Link ist zeitlich begrenzt gültig. Später erreichst du dasselbe
          über „Passwort vergessen" auf der Login-Seite.
        </p>
      </div>`;
  }

  // Konnte kein Link erzeugt werden – Account existiert trotzdem.
  return `
    <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
      <p style="margin: 0; font-size: 14px; color: #475569;">
        Für dich wurde ein Zugang zum Mitgliederbereich angelegt. Vergib dein
        Passwort über „Passwort vergessen" auf der Login-Seite:
        <a href="${LOGIN_URL}">${LOGIN_URL}</a>
      </p>
    </div>`;
}

// ── Stripe Signaturprüfung ───────────────────────────────────
async function verifyStripeSignature(
  body: string,
  signature: string,
  secret: string,
): Promise<boolean> {
  try {
    const parts = signature.split(',').reduce((acc, part) => {
      const [key, value] = part.split('=');
      acc[key] = value;
      return acc;
    }, {} as Record<string, string>);

    const timestamp = parts['t'];
    const sig       = parts['v1'];

    if (!timestamp || !sig) return false;

    const signedPayload = `${timestamp}.${body}`;

    const key = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign'],
    );

    const signatureBuffer = await crypto.subtle.sign(
      'HMAC',
      key,
      new TextEncoder().encode(signedPayload),
    );

    const expectedSig = Array.from(new Uint8Array(signatureBuffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');

    return expectedSig === sig;
  } catch {
    return false;
  }
}

// ── Resend Mail Helper ───────────────────────────────────────
async function sendMail(to: string, subject: string, html: string) {
  const res = await fetch('https://api.resend.com/emails', {
    method:  'POST',
    headers: {
      'Authorization': `Bearer ${RESEND_API_KEY}`,
      'Content-Type':  'application/json',
    },
    body: JSON.stringify({ from: FROM_EMAIL, to, subject, html }),
  });

  if (!res.ok) {
    const err = await res.json();
    console.error('Resend Fehler:', JSON.stringify(err));
  } else {
    console.log('Mail gesendet an:', to);
  }
}

// ── Datum formatieren ────────────────────────────────────────
function formatDate(date: string): string {
  if (!date) return '';
  const [year, month, day] = date.split('-');
  return `${day}.${month}.${year}`;
}

Deno.serve(async (req) => {
  const signature = req.headers.get('stripe-signature');
  if (!signature) {
    return new Response('Keine Signatur.', { status: 400 });
  }

  const body = await req.text();

  const isValid = await verifyStripeSignature(body, signature, STRIPE_WEBHOOK_SECRET);
  if (!isValid) {
    console.error('Ungültige Webhook-Signatur');
    return new Response('Ungültige Signatur.', { status: 400 });
  }

  const event = JSON.parse(body);

  switch (event.type) {
    case 'checkout.session.completed': {
      await handlePaymentSuccess(event.data.object);
      break;
    }
    case 'checkout.session.expired': {
      await handleSessionExpired(event.data.object);
      break;
    }
    default:
      console.log(`Unbekanntes Event: ${event.type}`);
  }

  return new Response(JSON.stringify({ received: true }), {
    headers: { 'Content-Type': 'application/json' },
  });
});

// ── Zahlung erfolgreich ──────────────────────────────────────
async function handlePaymentSuccess(session: Record<string, string>) {

  // 1. Booking auf paid setzen – NUR wenn sie noch pending ist.
  //    Stripe stellt Events mehrfach zu; der status-Filter macht diesen
  //    Schritt idempotent. Kommt keine Zeile zurück, wurde das Event schon
  //    verarbeitet → abbrechen, damit weder Account noch Mails doppelt entstehen.
  const { data: updated, error } = await dbUpdate(
    'bookings',
    { stripe_session_id: session.id, status: 'pending' },
    {
      status:                   'paid',
      stripe_payment_intent_id: session.payment_intent,
    },
    'id',
  );

  if (error) {
    console.error('Fehler beim Aktualisieren der Buchung:', JSON.stringify(error));
    return;
  }

  if (!updated) {
    console.log('Booking bereits verarbeitet oder nicht gefunden:', session.id);
    return;
  }

  console.log('Buchung auf paid gesetzt:', session.id);

  // 2. Booking-Details für Mail laden
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/bookings?stripe_session_id=eq.${encodeURIComponent(session.id)}&select=*,appointments(*)`,
    {
      headers: {
        'apikey':        SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
      },
    },
  );

  const bookings = await res.json();
  const booking  = bookings?.[0];

  if (!booking) {
    console.error('Booking nicht gefunden für Mail');
    return;
  }

  const appt        = booking.appointments;
  const productName = appt?.type === 'livetrading' ? 'Live Trading Session' : 'Mentoring';
  const date        = formatDate(appt?.date ?? '');
  const time        = (appt?.time ?? '').slice(0, 5);

  // 3. Account: nur für Mentoring. LiveTrading bekommt bewusst keinen Zugang.
  let accountHtml = '';
  if (appt?.type === 'mentoring') {
    const user = await findOrCreateUser(
      booking.customer_email,
      booking.customer_name ?? '',
      booking.customer_phone ?? '',
    );

    if (user) {
      // Buchung mit dem Account verknüpfen.
      await dbUpdate(
        'bookings',
        { stripe_session_id: session.id },
        { user_id: user.id },
      );

      const link = user.hasPassword ? null : await generateSetPasswordLink(booking.customer_email);
      accountHtml = accountSection(user.hasPassword, link);
    } else {
      console.error('Account konnte nicht angelegt/gefunden werden für:', booking.customer_email);
    }
  }

  // 4. Bestätigungsmail an Kunden
  await sendMail(
    booking.customer_email,
    `Buchungsbestätigung – ${productName}`,
    `
    <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto; color: #1a1a1a;">

      <div style="background: #0f172a; padding: 32px; border-radius: 16px 16px 0 0; text-align: center;">
        <h1 style="color: #22c55e; margin: 0; font-size: 24px;">Buchung bestätigt!</h1>
      </div>

      <div style="background: #f8fafc; padding: 32px; border-radius: 0 0 16px 16px;">
        <p style="margin: 0 0 16px;">Hallo <strong>${booking.customer_name}</strong>,</p>
        <p style="margin: 0 0 24px; color: #475569;">
          vielen Dank für deine Buchung. Ich freue mich auf unsere Zusammenarbeit!
          Hier sind deine Termindetails:
        </p>

        <div style="background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Produkt</td>
              <td style="padding: 8px 0; font-weight: 600; text-align: right;">${productName}</td>
            </tr>
            <tr style="border-top: 1px solid #f1f5f9;">
              <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Datum</td>
              <td style="padding: 8px 0; font-weight: 600; text-align: right;">${date}</td>
            </tr>
            <tr style="border-top: 1px solid #f1f5f9;">
              <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Uhrzeit</td>
              <td style="padding: 8px 0; font-weight: 600; text-align: right;">${time} Uhr</td>
            </tr>
          </table>
        </div>

        ${accountHtml}

        <p style="margin: 0 0 8px; color: #475569; font-size: 14px;">
          Du wirst in Kürze von mir kontaktiert um alle weiteren Details zu besprechen.
          Bei Fragen erreichst du mich jederzeit per E-Mail.
        </p>

        <p style="margin: 32px 0 0; color: #1a1a1a;">
          Bis bald,<br>
          <strong>Marcel Dichter</strong>
        </p>
      </div>

    </div>
    `,
  );

  // 5. Benachrichtigung an Admin
  await sendMail(
    ADMIN_EMAIL,
    `Neue Buchung – ${productName}`,
    `
    <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto; color: #1a1a1a;">

      <div style="background: #0f172a; padding: 24px; border-radius: 16px 16px 0 0;">
        <h2 style="color: #22c55e; margin: 0; font-size: 20px;">Neue Buchung eingegangen</h2>
      </div>

      <div style="background: #f8fafc; padding: 24px; border-radius: 0 0 16px 16px;">
        <div style="background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Produkt</td>
              <td style="padding: 8px 0; font-weight: 600; text-align: right;">${productName}</td>
            </tr>
            <tr style="border-top: 1px solid #f1f5f9;">
              <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Datum</td>
              <td style="padding: 8px 0; font-weight: 600; text-align: right;">${date}</td>
            </tr>
            <tr style="border-top: 1px solid #f1f5f9;">
              <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Uhrzeit</td>
              <td style="padding: 8px 0; font-weight: 600; text-align: right;">${time} Uhr</td>
            </tr>
            <tr style="border-top: 1px solid #f1f5f9;">
              <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Kunde</td>
              <td style="padding: 8px 0; font-weight: 600; text-align: right;">${booking.customer_name}</td>
            </tr>
            <tr style="border-top: 1px solid #f1f5f9;">
              <td style="padding: 8px 0; color: #64748b; font-size: 14px;">E-Mail</td>
              <td style="padding: 8px 0; font-weight: 600; text-align: right;">${booking.customer_email}</td>
            </tr>
            <tr style="border-top: 1px solid #f1f5f9;">
              <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Telefon</td>
              <td style="padding: 8px 0; font-weight: 600; text-align: right;">${booking.customer_phone}</td>
            </tr>
          </table>
        </div>
      </div>

    </div>
    `,
  );
}

// ── Session abgelaufen → Termin wieder freigeben ─────────────
async function handleSessionExpired(session: Record<string, string>) {
  const searchRes = await fetch(
    `${SUPABASE_URL}/rest/v1/bookings?stripe_session_id=eq.${session.id}&status=eq.pending&select=appointment_id`,
    {
      headers: {
        'apikey':        SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
      },
    }
  );
  const rows = await searchRes.json();

  if (!Array.isArray(rows) || rows.length === 0) {
    console.log('Keine pending Booking für Session:', session.id);
    return;
  }

  const appointmentId = rows[0].appointment_id;

  // Booking löschen
  await fetch(`${SUPABASE_URL}/rest/v1/bookings?stripe_session_id=eq.${session.id}`, {
    method: 'DELETE',
    headers: {
      'apikey':        SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
    },
  });

  // Termin wieder freigeben
  const { error: apptError } = await dbUpdate(
    'appointments',
    { id: appointmentId },
    { status: 'available' },
  );

  if (apptError) {
    console.error('Fehler beim Freigeben des Termins:', JSON.stringify(apptError));
  } else {
    console.log('Termin wieder freigegeben:', appointmentId);
  }
}

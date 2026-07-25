// Selbst-Service „Passwort vergessen".
//
// Erzeugt serverseitig (Service-Role) einen Recovery-Link über die GoTrue
// Admin-API und verschickt ihn über Resend – konsequent derselbe Mailweg wie
// die übrigen Funktionen, ohne Supabase-eigenes SMTP und dessen Rate-Limits.
//
// Antwortet IMMER mit 200, unabhängig davon ob die Adresse existiert. Sonst
// wäre der Endpunkt ein Kanal, um gültige Kundenadressen zu erraten.
//
// Wird vom Frontend über supabase.functions.invoke('request-password-reset')
// aufgerufen; der mitgeschickte anon-Key erfüllt verify_jwt.

const SUPABASE_URL   = Deno.env.get('SUPABASE_URL')!;
const SERVICE_KEY    = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')!;
const FROM_EMAIL     = Deno.env.get('FROM_EMAIL')!;
const APP_URL        = Deno.env.get('APP_URL')!;

const CORS = {
  'Access-Control-Allow-Origin':  '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-client-info, apikey',
};

const REDIRECT_TO = `${APP_URL.replace(/\/$/, '')}/passwort-setzen`;

// ── GoTrue Admin: Recovery-Link erzeugen ─────────────────────
async function generateRecoveryLink(email: string): Promise<string | null> {
  const res = await fetch(`${SUPABASE_URL}/auth/v1/admin/generate_link`, {
    method:  'POST',
    headers: {
      'apikey':        SERVICE_KEY,
      'Authorization': `Bearer ${SERVICE_KEY}`,
      'Content-Type':  'application/json',
    },
    body: JSON.stringify({ type: 'recovery', email, redirect_to: REDIRECT_TO }),
  });

  if (!res.ok) {
    // Häufigster Fall: Adresse hat kein Konto. Bewusst still.
    console.log('generate_link nicht möglich:', res.status);
    return null;
  }

  const data = await res.json();
  return data.action_link ?? data.properties?.action_link ?? null;
}

// ── Resend ───────────────────────────────────────────────────
async function sendMail(to: string, link: string) {
  const html = `
  <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto; color: #1a1a1a;">
    <div style="background: #0f172a; padding: 32px; border-radius: 16px 16px 0 0; text-align: center;">
      <h1 style="color: #22c55e; margin: 0; font-size: 24px;">Passwort zurücksetzen</h1>
    </div>
    <div style="background: #f8fafc; padding: 32px; border-radius: 0 0 16px 16px;">
      <p style="margin: 0 0 24px; color: #475569;">
        Du hast angefragt, dein Passwort zurückzusetzen. Über den folgenden Link
        vergibst du ein neues Passwort:
      </p>
      <a href="${link}"
         style="display: inline-block; background: #0f172a; color: #fff; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: 600;">
        Neues Passwort setzen →
      </a>
      <p style="margin: 24px 0 0; font-size: 13px; color: #64748b;">
        Der Link ist zeitlich begrenzt gültig. Hast du die Anfrage nicht
        gestellt, kannst du diese Mail ignorieren.
      </p>
    </div>
  </div>`;

  const res = await fetch('https://api.resend.com/emails', {
    method:  'POST',
    headers: {
      'Authorization': `Bearer ${RESEND_API_KEY}`,
      'Content-Type':  'application/json',
    },
    body: JSON.stringify({
      from: FROM_EMAIL, to, subject: 'Passwort zurücksetzen – KingSize', html,
    }),
  });
  if (!res.ok) console.error('Resend Fehler:', JSON.stringify(await res.json()));
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: CORS });

  // Immer 200 – die Antwort verrät nie, ob die Adresse existiert.
  const ok = () =>
    new Response(JSON.stringify({ ok: true }), {
      headers: { ...CORS, 'Content-Type': 'application/json' },
    });

  try {
    const { email } = await req.json();
    if (typeof email !== 'string' || !email.includes('@')) return ok();

    const link = await generateRecoveryLink(email.trim());
    if (link) await sendMail(email.trim(), link);
  } catch (err) {
    console.error('request-password-reset Fehler:', err);
  }

  return ok();
});

import { Component, input } from '@angular/core';

/**
 * Gemeinsames Gerüst aller Auth-Seiten (Login, Passwort-vergessen, Neues
 * Passwort): zentrierte Card mit Logo und Titel. Der Seiteninhalt (Felder,
 * Buttons, Hinweise) wird projiziert.
 *
 * Die Optik kommt aus der globalen Auth-Schicht
 * (src/styles/components/_auth.css), daher braucht die Komponente kein
 * eigenes Stylesheet.
 */
@Component({
  selector: 'app-auth-card',
  standalone: true,
  templateUrl: './auth-card.html',
})
export class AuthCardComponent {
  readonly title = input.required<string>();
}

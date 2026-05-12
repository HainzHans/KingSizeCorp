import {Component, input} from '@angular/core';
import {Router, NavigationEnd} from '@angular/router';

@Component({
  selector: 'app-king-size-button',
  templateUrl: './king-size-button.html',
  styleUrl: './king-size-button.css',
})
export class KingSizeButton {

  btnText = input<string>('');
  target = input<string>('');
  scrollTarget = input<string>(''); // optional

  constructor(private router: Router) {}

  navigateTo() {
    const currentUrl = this.router.url.replace('/', '');
    const targetUrl = this.target().replace('/', '');

    // Wenn wir schon auf der Seite sind → scrollen mit Offset
    if (currentUrl === targetUrl && this.scrollTarget()) {
      this.scrollWithOffset(this.scrollTarget(), 120);
      return;
    }

    // Navigation + danach nach oben scrollen
    this.router.navigate([this.target()]).then(() => {
      // Warten bis Navigation abgeschlossen ist
      this.router.events.subscribe(event => {
        if (event instanceof NavigationEnd) {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      });
    });
  }

  private scrollWithOffset(selector: string, offset: number) {
    const el = document.querySelector(selector);
    if (!el) return;

    const y = el.getBoundingClientRect().top + window.scrollY - offset;

    window.scrollTo({
      top: y,
      behavior: 'smooth'
    });
  }
}

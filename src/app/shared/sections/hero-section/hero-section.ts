import {AfterViewInit, Component, input} from '@angular/core';
import {KingSizeButton} from '../../components/king-size-button/king-size-button';
import {SmallDotComponent} from '../../components/small-dot-component/small-dot-component';
import {MainChipComponent} from '../../components/main-chip-component/main-chip-component';

@Component({
  selector: 'app-hero-section',
  imports: [
    KingSizeButton,
    SmallDotComponent,
    MainChipComponent
  ],
  templateUrl: './hero-section.html',
  styleUrl: './hero-section.css',
})
export class HeroSection implements AfterViewInit{

  videoUrl = input<string>('');
  introText = input<string>('');
  titleLine1 = input<string>('');
  titleLine2 = input<string>('');
  subTitleLine1 = input<string>('');
  subTitleLine2 = input<string>('');
  displayButton = input<boolean>(true);
  height = input<string>('');


  ngAfterViewInit() {
    const video = document.querySelector('.video-background') as HTMLVideoElement;
    if (!video) return;

    video.muted = true;
    video.load(); // explizit neu laden

    const tryPlay = () => {
      video.play().catch(() => {
        // Fallback: bei erster User-Interaktion nochmal versuchen
        document.addEventListener('click', () => video.play(), { once: true });
        document.addEventListener('touchstart', () => video.play(), { once: true });
      });
    };

    // Warten bis genug Daten geladen sind
    if (video.readyState >= 3) {
      tryPlay();
    } else {
      video.addEventListener('canplay', tryPlay, { once: true });
    }
  }

}

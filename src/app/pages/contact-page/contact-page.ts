import {Component, OnInit} from '@angular/core';
import {HeroSection} from '../../sections/shared/hero-section/hero-section';
import {
  BrandsAutoSliderComponent
} from '../../components/brands-auto-slider-component/brands-auto-slider-component';
import {FooterSection} from '../../sections/shared/footer-section/footer-section';
import {HeaderSection} from '../../sections/shared/header-section/header-section';
import {AppointmentFormSection} from '../../sections/contact/appointment-form-section/appointment-form-section';
import {SeoService} from '../../services/seo-service/seo-service';

@Component({
  selector: 'app-contact-page',
  imports: [
    HeroSection,
    BrandsAutoSliderComponent,
    AppointmentFormSection,
    FooterSection,
    HeaderSection
  ],
  templateUrl: './contact-page.html',
  styleUrl: './contact-page.css',
})
export class ContactPage implements OnInit {

  constructor(private seo: SeoService) {}

  ngOnInit() {
    this.seo.setPage({
      title: 'KingSize Corp – Trading Mentoring mit Marcel Dichter',
      description: 'Lerne profitabel zu traden und Märkte zu lesen mit meinem 1:1 Mentoring.',
      url: 'https://kingsize-corp.de',
    });
  }

}

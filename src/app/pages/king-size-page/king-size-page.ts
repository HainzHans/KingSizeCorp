import {Component, OnInit} from '@angular/core';
import {CardGridSection} from "../../sections/king-size/card-grid-section/card-grid-section";
import {ContactSection} from "../../sections/king-size/contact-section/contact-section";
import {CustomerRefSection} from "../../sections/king-size/customer-ref-section/customer-ref-section";
import {FooterSection} from "../../sections/shared/footer-section/footer-section";
import {IntroSection} from "../../sections/king-size/intro-section/intro-section";
import {StatisticSection} from "../../sections/king-size/statistic-section/statistic-section";
import {HeroSection} from "../../sections/shared/hero-section/hero-section";
import {BrandsAutoSliderComponent} from '../../components/brands-auto-slider-component/brands-auto-slider-component';
import {HeaderSection} from '../../sections/shared/header-section/header-section';
import {FaqSection} from '../../sections/king-size/faq-section/faq-section';
import {CommunitySection} from '../../sections/king-size/community-section/community-section';
import {SeoService} from '../../services/seo-service/seo-service';

@Component({
  selector: 'app-king-size-page',
  imports: [
    CardGridSection,
    ContactSection,
    CustomerRefSection,
    FooterSection,
    IntroSection,
    StatisticSection,
    HeroSection,
    BrandsAutoSliderComponent,
    HeaderSection,
    FaqSection,
    CommunitySection
  ],
  templateUrl: './king-size-page.html',
  styleUrl: './king-size-page.css',
})
export class KingSizePage implements OnInit {

  constructor(private seo: SeoService) {}

  ngOnInit() {
    this.seo.setPage({
      title: 'KingSize Corp – 1:1 Mentoring mit Marcel Dichter',
      description: 'Lerne profitabel zu traden und Märkte zu lesen mit meinem 1:1 Mentoring.',
      url: 'https://kingsize-corp.de',
    });
  }

}

import { Component } from '@angular/core';
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
export class KingSizePage {

}

import { Component } from '@angular/core';
import {CardGridSection} from "../../sections/card-grid-section/card-grid-section";
import {ContactSection} from "../../sections/contact-section/contact-section";
import {CustomerRefSection} from "../../sections/customer-ref-section/customer-ref-section";
import {FooterSection} from "../../../../shared/sections/footer-section/footer-section";
import {IntroSection} from "../../sections/intro-section/intro-section";
import {StatisticSection} from "../../sections/statistic-section/statistic-section";
import {HeroSection} from "../../../../shared/sections/hero-section/hero-section";
import {HeaderSection} from '../../../../shared/sections/header-section/header-section';
import {FaqSection} from '../../sections/faq-section/faq-section';
import {CommunitySection} from '../../sections/community-section/community-section';

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
    HeaderSection,
    FaqSection,
    CommunitySection
  ],
  templateUrl: './king-size-page.html',
  styleUrl: './king-size-page.css',
})
export class KingSizePage {

}

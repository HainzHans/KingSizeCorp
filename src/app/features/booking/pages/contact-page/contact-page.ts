import { Component } from '@angular/core';
import {HeroSection} from '../../../../shared/sections/hero-section/hero-section';
import {
  BrandsAutoSliderComponent
} from '../../../../shared/components/brands-auto-slider-component/brands-auto-slider-component';
import {FooterSection} from '../../../../shared/sections/footer-section/footer-section';
import {HeaderSection} from '../../../../shared/sections/header-section/header-section';
import {AppointmentFormSection} from '../../sections/appointment-form-section/appointment-form-section';

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
export class ContactPage {

}

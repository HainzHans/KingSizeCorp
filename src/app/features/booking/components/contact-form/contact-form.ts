import {Component, output} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {InputText} from 'primeng/inputtext';

@Component({
  selector: 'app-contact-form',
  imports: [
    InputText,
    ReactiveFormsModule
  ],
  templateUrl: './contact-form.html',
  styleUrl: './contact-form.css',
})
export class ContactForm {
  form = output<FormGroup>();

  contactForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.contactForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      phone:    ['', [Validators.required, Validators.pattern(/^\+?[\d\s\-()]{7,20}$/)]],
      email:    ['', [Validators.required, Validators.email]],
    });

    this.form.emit(this.contactForm);
  }
}

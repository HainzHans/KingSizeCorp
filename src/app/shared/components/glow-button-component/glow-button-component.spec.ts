import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { GlowButtonComponent } from './glow-button-component';

describe('GlowButtonComponent', () => {
  let component: GlowButtonComponent;
  let fixture: ComponentFixture<GlowButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GlowButtonComponent],
      providers: [provideRouter([])]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GlowButtonComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('label', 'Weiter');
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

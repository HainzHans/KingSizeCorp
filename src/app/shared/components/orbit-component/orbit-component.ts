import {AfterViewInit, Component, ElementRef} from '@angular/core';

@Component({
  selector: 'app-orbit-component',
  imports: [],
  templateUrl: './orbit-component.html',
  styleUrl: './orbit-component.css',
})
export class OrbitComponent implements AfterViewInit {
  private animationId: number = 0;

  constructor(private el: ElementRef) {}

  ngAfterViewInit() {
    const center = this.el.nativeElement.querySelector('.orbit-center');

    const icon1 = this.el.nativeElement.querySelector('#orbitIcon1');
    const icon2 = this.el.nativeElement.querySelector('#orbitIcon2');
    const icon3 = this.el.nativeElement.querySelector('#orbitIcon3');
    const icon4 = this.el.nativeElement.querySelector('#orbitIcon4');

    let angle1 = 0;
    let angle2 = Math.PI / 2;
    let angle3 = Math.PI;
    let angle4 = Math.PI * 1.5;

    const animate = () => {
      const size = center.offsetWidth;

      const r1 = size * 0.30; // 60% Orbit → Radius 30%
      const r2 = size * 0.40;
      const r3 = size * 0.50;
      const r4 = size * 0.60;

      angle1 += 0.02;
      angle2 += 0.02;
      angle3 += 0.02;
      angle4 += 0.02;

      icon1.style.transform = `translate(-50%, -50%) matrix(1,0,0,1,${r1*Math.cos(angle1)},${r1*Math.sin(angle1)})`;
      icon2.style.transform = `translate(-50%, -50%) matrix(1,0,0,1,${r2*Math.cos(angle2)},${r2*Math.sin(angle2)})`;
      icon3.style.transform = `translate(-50%, -50%) matrix(1,0,0,1,${r3*Math.cos(angle3)},${r3*Math.sin(angle3)})`;
      icon4.style.transform = `translate(-50%, -50%) matrix(1,0,0,1,${r4*Math.cos(angle4)},${r4*Math.sin(angle4)})`;

      this.animationId = requestAnimationFrame(animate);
    };

    animate();
  }

  ngOnDestroy() {
    cancelAnimationFrame(this.animationId);
  }


}

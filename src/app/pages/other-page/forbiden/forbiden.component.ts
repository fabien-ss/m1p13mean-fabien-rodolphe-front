import { Component } from '@angular/core';
import { GridShapeComponent } from '../../../shared/components/common/grid-shape/grid-shape.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-forbiden',
  imports: [
    GridShapeComponent,
    RouterModule,
  ],
  templateUrl: './forbiden.component.html',
  styles: ``
})
export class ForbidenComponent {

  currentYear: number = new Date().getFullYear();
}

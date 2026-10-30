import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  standalone: true,
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  name = 'Jayanth';
  age = 21;
  company = 'Simplify3X Private limited';
  role = 'Software Developer Trainee';
  imageUrl = 'https://angular.dev/assets/images/press-kit/angular_icon_gradient.gif';
  isDisabled = true;

}

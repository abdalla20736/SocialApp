import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { TimeagoModule } from 'ngx-timeago';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, TimeagoModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('Social Hub');
}

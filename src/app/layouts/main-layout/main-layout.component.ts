import { Component } from '@angular/core';

import { RouterOutlet } from '@angular/router';
import { Navbar } from './navbar/navbar.component';
import { Loading } from '../../shared/components/loading/loading.component';

@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet, Navbar, Loading],
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.css'],
})
export class MainLayout {}

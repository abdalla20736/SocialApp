import { Component } from '@angular/core';

import { RouterOutlet } from '@angular/router';
import { NavSidebarComponent } from '../nav-sidebar/nav-sidebar.component';
import { SocialSidebarComponent } from '../social-sidebar/social-sidebar.component';

@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet, NavSidebarComponent, SocialSidebarComponent],
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.css'],
})
export class MainLayoutComponent {}

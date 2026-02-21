import { Component } from '@angular/core';
import { SuggestionCard } from './suggestion-card/suggestion-card.component';

@Component({
  selector: 'app-social-sidebar',
  imports: [SuggestionCard],
  templateUrl: './social-sidebar.component.html',
  styleUrl: './social-sidebar.component.css',
})
export class SocialSidebar {
  isShowedSocialBar: boolean = false;

  ToggleSocialBar(): void {
    this.isShowedSocialBar = !this.isShowedSocialBar;
  }
}

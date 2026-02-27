import { Component } from '@angular/core';
import { SuggestionForm } from '../suggestion-form/suggestion-form.component';

@Component({
  selector: 'app-social-sidebar',
  imports: [SuggestionForm],
  templateUrl: './social-sidebar.component.html',
  styleUrl: './social-sidebar.component.css',
})
export class SocialSidebar {
  isShowedSocialBar: boolean = false;

  ToggleSocialBar() {
    this.isShowedSocialBar = !this.isShowedSocialBar;
  }
}

import { UserProfile } from './../../core/models/user-profile.model';
import { UserService } from './../../core/services/user.service';
import { Component, inject } from '@angular/core';
import { PostCardComponent } from "./post-card/post-card.component";

@Component({
  selector: 'app-timeline',
  imports: [PostCardComponent],
  templateUrl: './timeline.component.html',
  styleUrl: './timeline.component.css',
})
export class Timeline {
  private userService: UserService = inject(UserService);

  userProfile: UserProfile = this.userService.getCurrentUser() as UserProfile;
}

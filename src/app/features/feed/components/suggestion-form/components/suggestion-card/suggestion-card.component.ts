import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { SuggestedUser } from '../../../../../../core/models/user/suggested-user.model';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-suggestion-card',
  imports: [CommonModule],
  templateUrl: './suggestion-card.component.html',
  styleUrl: './suggestion-card.component.css',
})
export class SuggestionCard {
  private router: Router = inject(Router);
  @Input() FollowingState: 'not-following' | 'following' | 'followed' = 'not-following';
  @Input() suggestedUser!: SuggestedUser;
  @Output() follow = new EventEmitter<string>();

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = './images/default-profile.png';
  }
  followUser(): void {
    this.follow.emit(this.suggestedUser._id);
  }

  navigateToProfile(): void {
    this.router.navigate(['/profile', this.suggestedUser._id]);
  }
}

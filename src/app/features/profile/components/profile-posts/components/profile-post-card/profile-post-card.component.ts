import { Component, inject, Input } from '@angular/core';
import { Post } from '../../../../../../core/models/posts/post.model';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { ImageOverlay } from '../../../../../../shared/components/image-overlay/image-overlay.component';

@Component({
  selector: 'app-profile-post-card',
  imports: [DatePipe, ImageOverlay],
  templateUrl: './profile-post-card.component.html',
  styleUrl: './profile-post-card.component.css',
})
export class ProfilePostCard {
  private readonly router = inject(Router);

  selectedOverlayImageUrl: string = '';

  @Input() post!: Post;

  openPost(id: string): void {
    this.router.navigate(['/post', id]);
  }

  closeImageOverlay(event: Event) {
    if (!(event.target instanceof HTMLImageElement) && this.selectedOverlayImageUrl !== '') {
      this.selectedOverlayImageUrl = '';
    }
  }
  expandImage(imgUrl: string) {
    if (imgUrl == 'images/default-profile.png') return;
    this.selectedOverlayImageUrl = imgUrl;
  }
}

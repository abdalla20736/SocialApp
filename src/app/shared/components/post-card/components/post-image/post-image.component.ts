import { Component, Input } from '@angular/core';
import { ImageOverlay } from '../../../image-overlay/image-overlay.component';

@Component({
  selector: 'app-post-image',
  imports: [ImageOverlay],
  templateUrl: './post-image.component.html',
  styleUrl: './post-image.component.css',
})
export class PostImage {
  @Input() imageUrl: string = '';
  @Input() imageAlt: string = 'Post image';
  @Input() isSharedPost: boolean = false;

  selectedOverlayImageUrl: string = '';
  isImageError: boolean = false;
  expandImage(imgUrl: string) {
    this.selectedOverlayImageUrl = imgUrl;
  }
  closeImageOverlay(event: Event) {
    if (!(event.target instanceof HTMLImageElement) && this.selectedOverlayImageUrl !== '') {
      this.selectedOverlayImageUrl = '';
    }
  }
  onImageError(): void {
    this.isImageError = true;
  }
}

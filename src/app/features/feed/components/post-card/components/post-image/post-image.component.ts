import { Component, Input } from '@angular/core';
import { ImageOverlay } from '../../../../../../shared/components/image-overlay/image-overlay.component';

@Component({
  selector: 'app-post-image',
  imports: [ImageOverlay],
  templateUrl: './post-image.component.html',
  styleUrl: './post-image.component.css',
})
export class PostImage {
  @Input() imageUrl: string = '';
  @Input() imageAlt: string = 'Post image';

  selectedOverlayImageUrl: string = '';

  expandImage(imgUrl: string) {
    this.selectedOverlayImageUrl = imgUrl;
  }
  closeImageOverlay(event: Event) {
    if (!(event.target instanceof HTMLImageElement) && this.selectedOverlayImageUrl !== '') {
      this.selectedOverlayImageUrl = '';
    }
  }
}

import { Component, Input } from '@angular/core';
import { SharedPost } from '../../../../../../core/models/posts/shared-post.model';
import { PostImage } from "../post-image/post-image.component";

@Component({
  selector: 'app-shared-post-card',
  imports: [PostImage],
  templateUrl: './shared-post-card.component.html',
  styleUrl: './shared-post-card.component.css',
})
export class SharedPostCard {
  @Input() sharedPost!: SharedPost;
}

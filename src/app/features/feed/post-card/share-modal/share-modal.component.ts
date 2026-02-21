import { Component, Input } from '@angular/core';
import { Post } from '../../../../core/models/posts/post.model';

@Component({
  selector: 'app-share-modal',
  imports: [],
  templateUrl: './share-modal.component.html',
  styleUrl: './share-modal.component.css',
})
export class ShareModal {
  @Input() post!: Post;
}

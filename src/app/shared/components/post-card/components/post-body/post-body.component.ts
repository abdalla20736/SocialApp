import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Post } from '../../../../../core/models/posts/post.model';
import { SharedPostCard } from '../shared-post-card/shared-post-card.component';
import { PostImage } from '../post-image/post-image.component';

@Component({
  selector: 'app-post-body',
  imports: [SharedPostCard, PostImage],
  templateUrl: './post-body.component.html',
  styleUrl: './post-body.component.css',
})
export class PostBody {
  @Input() post?: Post;
  @Input() isPostSaved: boolean = false;
  @Input() isRegularPost: boolean = false;
}

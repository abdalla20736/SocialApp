import { Component, Input } from '@angular/core';
import { Post } from '../../../../../../../core/models/posts/post.model';

@Component({
  selector: 'app-top-comment',
  imports: [],
  templateUrl: './top-comment.component.html',
  styleUrl: './top-comment.component.css',
})
export class TopComment {
  @Input() post?: Post;
}

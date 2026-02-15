import { Component, Input } from '@angular/core';
import { Post } from '../../../core/models/post.model';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-post-card',
  imports: [RouterLink],
  templateUrl: './post-card.component.html',
  styleUrl: './post-card.component.css',
})
export class PostCardComponent {
  @Input() post!: Post;
}

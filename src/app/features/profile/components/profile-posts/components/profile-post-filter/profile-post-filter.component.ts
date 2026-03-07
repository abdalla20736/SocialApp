import { Component, EventEmitter, Input, Output, output } from '@angular/core';
import { Post } from '../../../../../../core/models/posts/post.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile-post-filter',
  imports: [CommonModule],
  templateUrl: './profile-post-filter.component.html',
  styleUrl: './profile-post-filter.component.css',
})
export class ProfilePostFilter {
  @Input() posts: Post[] = [];
  @Input() currentPostsCount!: number;

  @Output() loadFilteredPosts = new EventEmitter<'all' | 'bookmarks'>();

  selectedFilter: 'all' | 'bookmarks' = 'all';

  setFilter(filter: 'all' | 'bookmarks'): void {
    this.selectedFilter = filter;
    this.loadFilteredPosts.emit(filter);
  }
}

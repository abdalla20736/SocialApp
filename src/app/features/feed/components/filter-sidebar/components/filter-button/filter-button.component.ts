import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PostsFilter } from '../../../../../../shared/types/post-filter.type';

@Component({
  selector: 'app-filter-button',
  imports: [CommonModule],
  templateUrl: './filter-button.component.html',
  styleUrl: './filter-button.component.css',
})
export class FilterButton {
  @Input() selectedFilter!: PostsFilter;
  @Input() title!: string;
  @Input() filter!: PostsFilter;

  @Output() filterChanged = new EventEmitter<PostsFilter>();

  setFilter(filter: PostsFilter): void {
    this.filterChanged.emit(filter);
  }

  isSelected(): boolean {
    return this.selectedFilter === this.filter;
  }
}

import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { AuthService } from '../../../../../core/services/auth.service';
import { User } from '../../../../../core/models/auth/user.model';
import { PostsFilter } from '../../../../../shared/types/post-filter.type';
import { CommonModule } from '@angular/common';
import { FilterButton } from '../components/filter-button/filter-button.component';

@Component({
  selector: 'app-filter-sidebar',
  imports: [CommonModule, FilterButton],
  templateUrl: './filter-sidebar.component.html',
  styleUrl: './filter-sidebar.component.css',
})
export class FilterSidebar {
  private authService = inject(AuthService);

  user: User = this.authService.getCurrentUser();

  @Input() selectedFilter!: PostsFilter;
  @Output() filterChanged = new EventEmitter<PostsFilter>();

  setFilter(filter: PostsFilter): void {
    this.filterChanged.emit(filter);
  }

  onLogout(event: Event): void {
    event.preventDefault();
    this.authService.logout();
  }
}

import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingService } from '../../../core/services/loading.service';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (loadingService.loading$ | async) {
      <div
        class="fixed inset-0 z-100 flex items-center justify-center bg-slate-900/20 backdrop-blur-[2px]"
      >
        <div class="flex items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-xl">
          <span
            class="h-5 w-5 animate-spin rounded-full border-2 border-[#1877f2] border-t-transparent"
          ></span>
          <p class="text-sm font-semibold text-slate-700">Refreshing your timeline...</p>
        </div>
      </div>
    }
  `,
})
export class Loading {
  loadingService = inject(LoadingService);
}

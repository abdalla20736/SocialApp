import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { LoadingService } from '../services/loading.service';
import { finalize } from 'rxjs';

let isPageReloaded = window.performance
  ? (window.performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming)?.type ===
    'reload'
  : false;

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const loadingService = inject(LoadingService);
  if (isPageReloaded) {
    loadingService.show();
  }

  return next(req).pipe(
    finalize(() => {
      if (isPageReloaded) {
        loadingService.hide();
        isPageReloaded = false;
      }
    }),
  );
};

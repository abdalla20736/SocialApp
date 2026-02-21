import { Injectable } from '@angular/core';
import { TimeagoFormatter } from 'ngx-timeago';

@Injectable()
export class ShortTimeagoFormatter extends TimeagoFormatter {
  override format(then: number): string {
    const seconds = Math.floor((Date.now() - then) / 1000);

    if (seconds < 60) return `${seconds}s`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`;
    if (seconds < 2592000) return `${Math.floor(seconds / 86400)}d`;
    if (seconds < 31536000) return `${Math.floor(seconds / 2592000)}mo`;

    return `${Math.floor(seconds / 31536000)}y`;
  }
}

import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-feature-card',
  imports: [],
  templateUrl: './feature-card.component.html',
  styleUrl: './feature-card.component.css',
})
export class FeatureCard {
  @Input() icon: string = 'fa-message';
  @Input() iconColor: string = 'text-green-300';
  @Input() backgroundColor: string = 'bg-teal-400/20';
}

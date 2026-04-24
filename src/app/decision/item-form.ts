import { ChangeDetectionStrategy, Component, inject, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DecisionStore } from './decision-store';
import type { Kind } from './decision.types';

@Component({
  selector: 'app-item-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './item-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ItemFormComponent {
  readonly kind = input.required<Kind>();

  private readonly store = inject(DecisionStore);
  protected readonly draft = signal('');

  protected get placeholder(): string {
    return this.kind() === 'plus' ? 'Add a plus…' : 'Add a minus…';
  }

  protected handleSubmit(event: Event): void {
    event.preventDefault();
    const text = this.draft().trim();
    if (!text) return;
    this.store.addItem({ kind: this.kind(), text });
    this.draft.set('');
  }
}

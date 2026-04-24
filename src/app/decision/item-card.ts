import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { CdkDrag, CdkDragHandle } from '@angular/cdk/drag-drop';
import { FormsModule } from '@angular/forms';
import { DecisionStore } from './decision-store';
import type { DecisionItem, Kind } from './decision.types';

@Component({
  selector: 'app-item-card',
  standalone: true,
  imports: [CdkDrag, CdkDragHandle, FormsModule],
  templateUrl: './item-card.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ItemCardComponent {
  readonly item = input.required<DecisionItem>();
  readonly kind = input.required<Kind>();

  private readonly store = inject(DecisionStore);
  private readonly editInput = viewChild<ElementRef<HTMLInputElement>>('editInput');

  protected readonly editing = signal(false);
  protected readonly draft = signal('');

  protected get accent(): string {
    return this.kind() === 'plus' ? 'emerald' : 'rose';
  }

  protected startEdit(): void {
    this.draft.set(this.item().text);
    this.editing.set(true);
    queueMicrotask(() => this.editInput()?.nativeElement.focus());
  }

  protected commitEdit(): void {
    const text = this.draft().trim();
    if (text && text !== this.item().text) {
      this.store.updateItem({ kind: this.kind(), id: this.item().id, text });
    }
    this.editing.set(false);
  }

  protected cancelEdit(): void {
    this.editing.set(false);
  }

  protected handleDelete(): void {
    this.store.deleteItem({ kind: this.kind(), id: this.item().id });
  }
}

import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { CdkDrag, CdkDragDrop, CdkDropList } from '@angular/cdk/drag-drop';
import { DecisionStore } from './decision-store';
import type { DecisionItem, Kind } from './decision.types';
import { ItemCardComponent } from './item-card';
import { ItemFormComponent } from './item-form';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CdkDropList, CdkDrag, ItemCardComponent, ItemFormComponent],
  templateUrl: './dashboard.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent {
  readonly kind = input.required<Kind>();

  private readonly store = inject(DecisionStore);

  protected readonly items = computed<ReadonlyArray<DecisionItem>>(() =>
    this.kind() === 'plus' ? this.store.pluses() : this.store.minuses(),
  );
  protected readonly count = computed(() => this.items().length);

  protected get title(): string {
    return this.kind() === 'plus' ? 'Pluses' : 'Minuses';
  }

  protected get symbol(): string {
    return this.kind() === 'plus' ? '+' : '−';
  }

  protected handleDrop(event: CdkDragDrop<DecisionItem[]>): void {
    this.store.reorderItem({
      kind: this.kind(),
      fromIndex: event.previousIndex,
      toIndex: event.currentIndex,
    });
  }

  protected trackById(_index: number, item: DecisionItem): string {
    return item.id;
  }
}

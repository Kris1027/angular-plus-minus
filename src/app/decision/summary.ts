import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { DecisionStore } from './decision-store';

type Badge = {
  label: string;
  tone: 'jade' | 'clay' | 'stone' | 'tie';
};

@Component({
  selector: 'app-summary',
  standalone: true,
  templateUrl: './summary.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SummaryComponent {
  private readonly store = inject(DecisionStore);

  protected readonly plusCount = this.store.plusCount;
  protected readonly minusCount = this.store.minusCount;

  protected readonly diff = computed(() => this.plusCount() - this.minusCount());

  protected readonly badge = computed<Badge>(() => {
    switch (this.store.verdict()) {
      case 'plus':
        return { label: 'Pluses win — lean toward yes', tone: 'jade' };
      case 'minus':
        return { label: 'Minuses win — think twice', tone: 'clay' };
      case 'tie':
        return { label: 'Tied — keep weighing', tone: 'tie' };
      case 'empty':
      default:
        return { label: 'Add some items to see a verdict', tone: 'stone' };
    }
  });
}

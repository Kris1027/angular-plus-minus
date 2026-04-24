import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DecisionStore } from './decision/decision-store';
import { DashboardComponent } from './decision/dashboard';
import { SummaryComponent } from './decision/summary';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule, DashboardComponent, SummaryComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  protected readonly store = inject(DecisionStore);

  protected handleTopicChange(value: string): void {
    this.store.setTopic(value);
  }

  protected handleReset(): void {
    const hasData =
      this.store.topic().length > 0 ||
      this.store.pluses().length > 0 ||
      this.store.minuses().length > 0;
    if (!hasData) return;
    if (typeof window !== 'undefined' && !window.confirm('Reset topic and all items?')) return;
    this.store.reset();
  }
}

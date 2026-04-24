import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  computed,
  inject,
  viewChild,
} from '@angular/core';
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
  private readonly resetDialog = viewChild<ElementRef<HTMLDialogElement>>('resetDialog');

  protected readonly canReset = computed(
    () => this.store.plusCount() + this.store.minusCount() > 0,
  );

  protected handleTopicChange(value: string): void {
    this.store.setTopic(value);
  }

  protected handleReset(): void {
    if (!this.canReset()) return;
    this.resetDialog()?.nativeElement.showModal();
  }

  protected confirmReset(): void {
    this.store.reset();
    this.resetDialog()?.nativeElement.close();
  }
}

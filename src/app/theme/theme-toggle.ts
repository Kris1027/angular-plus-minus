import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ThemeStore } from './theme-store';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  templateUrl: './theme-toggle.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThemeToggleComponent {
  private readonly store = inject(ThemeStore);

  protected readonly isDark = computed(() => this.store.theme() === 'dark');

  protected handleToggle(): void {
    this.store.toggle();
  }
}

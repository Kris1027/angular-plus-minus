import { Injectable, PLATFORM_ID, effect, inject, signal } from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';

type Theme = 'light' | 'dark';

const STORAGE_KEY = 'theme';

@Injectable({ providedIn: 'root' })
export class ThemeStore {
  private readonly doc = inject(DOCUMENT);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  readonly theme = signal<Theme>(this.resolveInitial());

  constructor() {
    effect(() => {
      if (!this.isBrowser) return;
      const t = this.theme();
      this.doc.documentElement.classList.toggle('dark', t === 'dark');
      try {
        localStorage.setItem(STORAGE_KEY, t);
      } catch {
        // storage unavailable — ignore
      }
    });
  }

  toggle(): void {
    this.theme.update((t) => (t === 'dark' ? 'light' : 'dark'));
  }

  private resolveInitial(): Theme {
    if (!this.isBrowser) return 'light';
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === 'dark' || stored === 'light') return stored;
    } catch {
      // ignore
    }
    if (
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-color-scheme: dark)').matches
    ) {
      return 'dark';
    }
    return 'light';
  }
}

import { Injectable, PLATFORM_ID, computed, effect, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import {
  EMPTY_STATE,
  STORAGE_KEY,
  type DecisionItem,
  type DecisionState,
  type Kind,
  type Verdict,
} from './decision.types';

const listKey = (kind: Kind): 'pluses' | 'minuses' => (kind === 'plus' ? 'pluses' : 'minuses');

const loadFromStorage = (): DecisionState => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY_STATE;
    const parsed = JSON.parse(raw) as Partial<DecisionState>;
    return {
      topic: typeof parsed.topic === 'string' ? parsed.topic : '',
      pluses: Array.isArray(parsed.pluses) ? (parsed.pluses as DecisionItem[]) : [],
      minuses: Array.isArray(parsed.minuses) ? (parsed.minuses as DecisionItem[]) : [],
    };
  } catch {
    return EMPTY_STATE;
  }
};

@Injectable({ providedIn: 'root' })
export class DecisionStore {
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly state = signal<DecisionState>(this.isBrowser ? loadFromStorage() : EMPTY_STATE);

  readonly topic = computed(() => this.state().topic);
  readonly pluses = computed(() => this.state().pluses);
  readonly minuses = computed(() => this.state().minuses);
  readonly plusCount = computed(() => this.pluses().length);
  readonly minusCount = computed(() => this.minuses().length);
  readonly verdict = computed<Verdict>(() => {
    const p = this.plusCount();
    const m = this.minusCount();
    if (p === 0 && m === 0) return 'empty';
    if (p > m) return 'plus';
    if (m > p) return 'minus';
    return 'tie';
  });

  constructor() {
    effect(() => {
      if (!this.isBrowser) return;
      const current = this.state();
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
      } catch {
        // storage quota or disabled — ignore
      }
    });
  }

  setTopic(topic: string): void {
    this.state.update((s) => ({ ...s, topic }));
  }

  addItem({ kind, text }: { kind: Kind; text: string }): void {
    const trimmed = text.trim();
    if (!trimmed) return;
    const item: DecisionItem = {
      id: this.nextId(),
      text: trimmed,
      createdAt: Date.now(),
    };
    const key = listKey(kind);
    this.state.update((s) => ({ ...s, [key]: [...s[key], item] }));
  }

  updateItem({ kind, id, text }: { kind: Kind; id: string; text: string }): void {
    const trimmed = text.trim();
    if (!trimmed) return;
    const key = listKey(kind);
    this.state.update((s) => ({
      ...s,
      [key]: s[key].map((item) => (item.id === id ? { ...item, text: trimmed } : item)),
    }));
  }

  deleteItem({ kind, id }: { kind: Kind; id: string }): void {
    const key = listKey(kind);
    this.state.update((s) => ({
      ...s,
      [key]: s[key].filter((item) => item.id !== id),
    }));
  }

  reorderItem({
    kind,
    fromIndex,
    toIndex,
  }: {
    kind: Kind;
    fromIndex: number;
    toIndex: number;
  }): void {
    if (fromIndex === toIndex) return;
    const key = listKey(kind);
    this.state.update((s) => {
      const next = [...s[key]];
      const [moved] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, moved);
      return { ...s, [key]: next };
    });
  }

  reset(): void {
    this.state.set(EMPTY_STATE);
    if (this.isBrowser) {
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch {
        // ignore
      }
    }
  }

  private nextId(): string {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
      return crypto.randomUUID();
    }
    return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
  }
}

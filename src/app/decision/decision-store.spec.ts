import { TestBed } from '@angular/core/testing';
import { DecisionStore } from './decision-store';
import { STORAGE_KEY } from './decision.types';

describe('DecisionStore', () => {
  let store: DecisionStore;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    store = TestBed.inject(DecisionStore);
  });

  it('starts with empty state', () => {
    expect(store.topic()).toBe('');
    expect(store.pluses()).toEqual([]);
    expect(store.minuses()).toEqual([]);
    expect(store.verdict()).toBe('empty');
  });

  it('adds plus and minus items immutably', () => {
    const before = store.pluses();
    store.addItem({ kind: 'plus', text: 'good pay' });
    store.addItem({ kind: 'minus', text: 'long commute' });

    expect(store.pluses().length).toBe(1);
    expect(store.minuses().length).toBe(1);
    expect(store.pluses()[0].text).toBe('good pay');
    expect(store.pluses()).not.toBe(before);
  });

  it('ignores empty or whitespace-only additions', () => {
    store.addItem({ kind: 'plus', text: '' });
    store.addItem({ kind: 'plus', text: '   ' });
    expect(store.pluses().length).toBe(0);
  });

  it('updates an item by id', () => {
    store.addItem({ kind: 'plus', text: 'original' });
    const id = store.pluses()[0].id;
    store.updateItem({ kind: 'plus', id, text: 'edited' });
    expect(store.pluses()[0].text).toBe('edited');
  });

  it('deletes an item by id', () => {
    store.addItem({ kind: 'minus', text: 'a' });
    store.addItem({ kind: 'minus', text: 'b' });
    const [first] = store.minuses();
    store.deleteItem({ kind: 'minus', id: first.id });
    expect(store.minuses().length).toBe(1);
    expect(store.minuses()[0].text).toBe('b');
  });

  it('reorders items', () => {
    store.addItem({ kind: 'plus', text: 'a' });
    store.addItem({ kind: 'plus', text: 'b' });
    store.addItem({ kind: 'plus', text: 'c' });
    store.reorderItem({ kind: 'plus', fromIndex: 0, toIndex: 2 });
    expect(store.pluses().map((i) => i.text)).toEqual(['b', 'c', 'a']);
  });

  it('computes verdict for each outcome', () => {
    expect(store.verdict()).toBe('empty');

    store.addItem({ kind: 'plus', text: 'p1' });
    expect(store.verdict()).toBe('plus');

    store.addItem({ kind: 'minus', text: 'm1' });
    expect(store.verdict()).toBe('tie');

    store.addItem({ kind: 'minus', text: 'm2' });
    expect(store.verdict()).toBe('minus');
  });

  it('persists changes to localStorage', async () => {
    store.setTopic('new job');
    store.addItem({ kind: 'plus', text: 'pay' });
    await Promise.resolve();
    TestBed.flushEffects();

    const raw = localStorage.getItem(STORAGE_KEY);
    expect(raw).not.toBeNull();
    const parsed = JSON.parse(raw!);
    expect(parsed.topic).toBe('new job');
    expect(parsed.pluses[0].text).toBe('pay');
  });

  it('reset clears state and removes storage key', async () => {
    store.setTopic('topic');
    store.addItem({ kind: 'plus', text: 'p' });
    TestBed.flushEffects();
    expect(localStorage.getItem(STORAGE_KEY)).not.toBeNull();

    store.reset();
    expect(store.topic()).toBe('');
    expect(store.pluses()).toEqual([]);
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
  });
});

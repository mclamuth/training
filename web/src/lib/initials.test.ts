import { describe, expect, it } from 'vitest';
import { initials } from './initials';

describe('initials', () => {
  it.each([
    ['Pat Nguyen', 'PN'],
    ['Maria de la Cruz', 'MC'],
    ['Cher', 'C'],
    ['  sam   rivera ', 'SR'],
    ['', '?'],
  ])('%s -> %s', (name, expected) => {
    expect(initials(name)).toBe(expected);
  });
});

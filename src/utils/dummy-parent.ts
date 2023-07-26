import { child } from './dummy-child.js';

export function parent(): string {
  return `foo${child()}`;
}

import { child } from './dummy-child';

export function parent(): string {
  return `foo${child()}`;
}

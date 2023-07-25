export function parent(): string {
  return `foo${child()}`;
}

export function child(): string {
  console.log('calling actual child');
  return 'bar';
}

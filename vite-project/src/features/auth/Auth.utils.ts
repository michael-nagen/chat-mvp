export function canSubmit(name: string, isLoading: boolean): boolean {
  return name.trim().length > 0 && !isLoading;
}

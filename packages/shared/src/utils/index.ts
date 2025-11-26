export function formatTimestamp(date: Date): string {
  return date.toISOString();
}

export function isValidLogLevel(level: string): boolean {
  return ['debug', 'info', 'warn', 'error', 'critical'].includes(level);
}

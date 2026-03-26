/**
 * Generate a simple unique ID for local records.
 * Uses timestamp + random suffix — sufficient for local-only MVP data.
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

/**
 * Checks if an event target is within a node matching the given CSS selector.
 * Used to prevent pan/zoom when interacting with specific elements.
 */
export function isTargetInSelector(
  event: Event,
  selector: string
): boolean {
  const target = event.target as HTMLElement | null;
  if (!target) return false;
  return target.closest(selector) !== null;
}

/**
 * Standard "no-pan" class check.
 */
export function shouldPreventPan(
  event: Event,
  noPanClassName = 'gc-nopan'
): boolean {
  return isTargetInSelector(event, `.${noPanClassName}`);
}

export function parseDurationToSeconds(
  input: string | number | undefined,
  fallbackSeconds: number,
): number {
  if (input === undefined || input === null) return fallbackSeconds;

  if (typeof input === 'number') {
    return Number.isFinite(input)
      ? Math.max(0, Math.floor(input))
      : fallbackSeconds;
  }

  const raw = input.trim();
  if (!raw) return fallbackSeconds;

  // Plain integer string => seconds
  if (/^\d+$/.test(raw)) return Math.max(0, parseInt(raw, 10));

  const match = raw.match(/^(\d+(?:\.\d+)?)(ms|s|m|h|d)$/i);
  if (!match) return fallbackSeconds;

  const value = Number(match[1]);
  if (!Number.isFinite(value)) return fallbackSeconds;

  const unit = match[2].toLowerCase();
  const seconds =
    unit === 'ms'
      ? value / 1000
      : unit === 's'
        ? value
        : unit === 'm'
          ? value * 60
          : unit === 'h'
            ? value * 60 * 60
            : value * 60 * 60 * 24; // d

  return Math.max(0, Math.floor(seconds));
}

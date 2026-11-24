import { CurrencyCode } from '../types/domain';

export const DEFAULT_USD_TO_UGX_RATE = 3680;

export function convertCurrency(
  amount: number,
  from: CurrencyCode,
  to: CurrencyCode,
  usdToUgxRate: number
): number {
  if (from === to) return amount;
  if (from === 'UGX' && to === 'USD') {
    return amount / usdToUgxRate;
  }
  return amount * usdToUgxRate;
}

export function formatProgramMoney(
  amountInUgx: number,
  displayCurrency: CurrencyCode,
  usdToUgxRate: number,
  options?: { compact?: boolean }
): string {
  const value = convertCurrency(amountInUgx, 'UGX', displayCurrency, usdToUgxRate);

  if (options?.compact) {
    if (displayCurrency === 'UGX') {
      if (Math.abs(value) >= 1_000_000_000) {
        return `UGX ${(value / 1_000_000_000).toFixed(2)}B`;
      }
      if (Math.abs(value) >= 1_000_000) {
        return `UGX ${(value / 1_000_000).toFixed(1)}M`;
      }
      return `UGX ${Math.round(value).toLocaleString('en-UG')}`;
    } else {
      if (Math.abs(value) >= 1_000_000) {
        return `$${(value / 1_000_000).toFixed(2)}M`;
      }
      if (Math.abs(value) >= 1_000) {
        return `$${(value / 1_000).toFixed(1)}K`;
      }
      return `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
  }

  if (displayCurrency === 'UGX') {
    return `UGX ${Math.round(value).toLocaleString('en-UG')}`;
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export async function fetchLiveUsdToUgxRate(): Promise<{ rate: number; source: 'live-api' | 'fallback-reference' }> {
  try {
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 5000);
    const response = await fetch('https://open.er-api.com/v6/latest/USD', {
      signal: controller.signal,
    });
    window.clearTimeout(timeout);

    if (!response.ok) {
      throw new Error('Exchange rate endpoint unavailable');
    }
    const payload = (await response.json()) as { rates?: Record<string, number> };
    const rate = payload?.rates?.UGX;
    if (typeof rate === 'number' && rate > 1000 && rate < 10000) {
      return { rate: Math.round(rate * 100) / 100, source: 'live-api' };
    }
    return { rate: DEFAULT_USD_TO_UGX_RATE, source: 'fallback-reference' };
  } catch {
    return { rate: DEFAULT_USD_TO_UGX_RATE, source: 'fallback-reference' };
  }
}

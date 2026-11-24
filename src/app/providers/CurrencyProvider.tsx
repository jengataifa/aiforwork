import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { CurrencyCode, ExchangeRateState } from '../../types/domain';
import {
  DEFAULT_USD_TO_UGX_RATE,
  fetchLiveUsdToUgxRate,
  formatProgramMoney,
} from '../../utils/currency';

interface CurrencyContextValue {
  currency: CurrencyCode;
  setCurrency: (next: CurrencyCode) => void;
  toggleCurrency: () => void;
  exchangeRate: ExchangeRateState;
  refreshRate: () => Promise<void>;
  formatMoney: (amountInUgx: number, options?: { compact?: boolean }) => string;
}

const CurrencyContext = createContext<CurrencyContextValue | undefined>(undefined);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrency] = useState<CurrencyCode>('UGX');
  const [exchangeRate, setExchangeRate] = useState<ExchangeRateState>({
    usdToUgx: DEFAULT_USD_TO_UGX_RATE,
    ugxToUsd: Number((1 / DEFAULT_USD_TO_UGX_RATE).toFixed(6)),
    lastUpdatedIso: new Date().toISOString(),
    source: 'fallback-reference',
    isRefreshing: false,
  });

  const refreshRate = useCallback(async () => {
    setExchangeRate((prev) => ({ ...prev, isRefreshing: true }));
    const result = await fetchLiveUsdToUgxRate();
    setExchangeRate({
      usdToUgx: result.rate,
      ugxToUsd: Number((1 / result.rate).toFixed(6)),
      lastUpdatedIso: new Date().toISOString(),
      source: result.source,
      isRefreshing: false,
    });
  }, []);

  useEffect(() => {
    void refreshRate();
  }, [refreshRate]);

  const toggleCurrency = useCallback(() => {
    setCurrency((prev) => (prev === 'UGX' ? 'USD' : 'UGX'));
  }, []);

  const formatMoney = useCallback(
    (amountInUgx: number, options?: { compact?: boolean }) =>
      formatProgramMoney(amountInUgx, currency, exchangeRate.usdToUgx, options),
    [currency, exchangeRate.usdToUgx]
  );

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        setCurrency,
        toggleCurrency,
        exchangeRate,
        refreshRate,
        formatMoney,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency(): CurrencyContextValue {
  const ctx = useContext(CurrencyContext);
  if (!ctx) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return ctx;
}

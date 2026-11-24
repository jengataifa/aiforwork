export type CurrencyCode = 'UGX' | 'USD';

export type UgandaRegionId = 'central' | 'eastern' | 'northern' | 'western';

export enum BeneficiaryApplicationStatus {
  Draft = 'Draft',
  Submitted = 'Submitted',
  UnderReview = 'Under Review',
  Approved = 'Approved',
  AssignedToCohort = 'Assigned to Cohort',
  Active = 'Active',
  Completed = 'Completed',
  Rejected = 'Rejected',
  Waitlisted = 'Waitlisted',
  Withdrawn = 'Withdrawn',
}

export interface ExchangeRateState {
  usdToUgx: number;
  ugxToUsd: number;
  lastUpdatedIso: string;
  source: 'live-api' | 'fallback-reference';
  isRefreshing: boolean;
}

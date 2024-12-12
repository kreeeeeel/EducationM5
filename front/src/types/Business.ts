// src/types/Business.ts

export interface Business {
    id: number;
    name: string;
    image: string;
    type: BusinessType;
    description: string;
    isOwned: boolean;
    level: number;
    requiredLevel: number;
    maxLevel: number;
    passiveIncome: number;
    upgradeCost: number;
}

export type BusinessType =
  | 'CLAIM_TIME'
  | 'DISCOUNT_UPGRADE_CAR'
  | 'REFERRAL_BONUS'
  | 'RACING_TIME';

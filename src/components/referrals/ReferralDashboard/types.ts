import { BaseProps } from '../../../types/common';
import { Referral, ReferralMetrics } from '../../../types/referral';

export interface ReferralDashboardProps extends BaseProps {
  metrics: ReferralMetrics;
  recentReferrals: Referral[];
  onReferralSelect: (referralId: string) => void;
}

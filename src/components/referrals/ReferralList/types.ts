import { BaseProps } from '../../../types/common';
import { Referral, ReferralStatus } from '../../../types/referral';

export interface ReferralListProps extends BaseProps {
  referrals: Referral[];
  onReferralSelect: (referralId: string) => void;
  onStatusChange: (referralId: string, status: ReferralStatus) => void;
}

import { BaseProps } from '../../../types/common';
import { Comment, Referral } from '../../../types/referral';

export interface ReferralDetailsProps extends BaseProps {
  referral: Referral;
  onUpdate: (referral: Referral) => void;
  onAddComment: (
    referralId: string,
    comment: Omit<Comment, 'id' | 'createdAt' | 'updatedAt'>
  ) => void;
}

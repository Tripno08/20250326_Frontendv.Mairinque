import { BaseProps } from '../../../types/common';
import { Referral } from '../../../types/referral';

export interface ReferralBuilderProps extends BaseProps {
  onSubmit: (referral: Omit<Referral, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}

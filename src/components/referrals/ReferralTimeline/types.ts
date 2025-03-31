import { BaseProps } from '../../../types/common';
import { HistoryItem } from '../../../types/referral';

export interface ReferralTimelineProps extends BaseProps {
  history: HistoryItem[];
}

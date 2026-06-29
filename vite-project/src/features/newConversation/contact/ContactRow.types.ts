import type { UserSummary } from '../../../shared/entities/User.types';

export type ContactRowProps = {
  contact: UserSummary;
};

export type ContactRowViewProps = {
  contact: UserSummary;
  isSelected: boolean;
  onToggle: () => void;
};

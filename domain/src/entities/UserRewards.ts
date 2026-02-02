export interface UserRewards {
  id: string;
  userId: string;
  totalPoints: number;
  pointsUsed: number;
  currentPoints: number;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  lastUpdated: Date;
  birthDate?: Date;
  birthdayBonusEligible: boolean;
}

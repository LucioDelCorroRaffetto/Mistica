import { UserRewards } from "../entities/UserRewards";

// Mock data for rewards
const rewardsDB: UserRewards[] = [];

const TIER_THRESHOLDS = {
  bronze: 0,
  silver: 2500,
  gold: 5000,
  platinum: 10000,
};

const TIER_MULTIPLIERS = {
  bronze: 1,
  silver: 1.1,
  gold: 1.25,
  platinum: 1.5,
};

function getUserRewards(userId: string): UserRewards {
  let rewards = rewardsDB.find((r) => r.userId === userId);
  if (!rewards) {
    rewards = {
      id: `rewards-${Date.now()}`,
      userId,
      totalPoints: 0,
      pointsUsed: 0,
      currentPoints: 0,
      tier: "bronze",
      lastUpdated: new Date(),
      birthdayBonusEligible: true,
    };
    rewardsDB.push(rewards);
  }
  return rewards;
}

function addPoints(userId: string, amount: number): UserRewards {
  const rewards = getUserRewards(userId);
  const multiplier = TIER_MULTIPLIERS[rewards.tier as keyof typeof TIER_MULTIPLIERS];
  const pointsToAdd = Math.floor(amount * 1 * multiplier);
  rewards.totalPoints += pointsToAdd;
  rewards.currentPoints += pointsToAdd;
  rewards.lastUpdated = new Date();
  updateTier(rewards);
  return rewards;
}

function usePoints(userId: string, amount: number): UserRewards {
  const rewards = getUserRewards(userId);
  if (rewards.currentPoints < amount) {
    throw new Error("Insufficient points");
  }
  rewards.currentPoints -= amount;
  rewards.pointsUsed += amount;
  rewards.lastUpdated = new Date();
  return rewards;
}

function updateTier(rewards: UserRewards): void {
  const thresholds = Object.entries(TIER_THRESHOLDS).sort(
    ([, a], [, b]) => b - a
  );
  for (const [tier, threshold] of thresholds) {
    if (rewards.totalPoints >= threshold) {
      rewards.tier = tier as any;
      break;
    }
  }
}

function addBirthdayBonus(userId: string): UserRewards {
  const rewards = getUserRewards(userId);
  if (rewards.birthdayBonusEligible && rewards.birthDate) {
    const today = new Date();
    const birthday = new Date(rewards.birthDate);
    birthday.setFullYear(today.getFullYear());
    if (
      today.getMonth() === birthday.getMonth() &&
      today.getDate() === birthday.getDate()
    ) {
      const bonusPoints = 500;
      rewards.currentPoints += bonusPoints;
      rewards.totalPoints += bonusPoints;
      rewards.birthdayBonusEligible = false;
      rewards.lastUpdated = new Date();
    }
  }
  return rewards;
}

export function getMyRewards(userId: string): UserRewards {
  return getUserRewards(userId);
}

export function earnPoints(userId: string, amount: number): UserRewards {
  return addPoints(userId, amount);
}

export function spendPoints(userId: string, amount: number): UserRewards {
  return usePoints(userId, amount);
}

export function claimBirthdayBonus(userId: string): UserRewards {
  return addBirthdayBonus(userId);
}

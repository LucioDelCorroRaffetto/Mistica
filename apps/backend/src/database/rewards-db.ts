import { UserRewards } from "@domain/src/entities/UserRewards";

export let rewardsDB: UserRewards[] = [
  {
    id: "rewards-001",
    userId: "user-001",
    totalPoints: 5000,
    pointsUsed: 1000,
    currentPoints: 4000,
    tier: "gold",
    lastUpdated: new Date("2024-11-15"),
    birthDate: new Date("1990-05-15"),
    birthdayBonusEligible: true,
  },
  {
    id: "rewards-002",
    userId: "user-002",
    totalPoints: 2500,
    pointsUsed: 500,
    currentPoints: 2000,
    tier: "silver",
    lastUpdated: new Date("2024-11-10"),
    birthDate: new Date("1995-08-22"),
    birthdayBonusEligible: false,
  },
];

const POINTS_PER_PESO = 1; // 1 point per peso spent
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

export function getUserRewards(userId: string): UserRewards {
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

export function addPoints(userId: string, amount: number): UserRewards {
  const rewards = getUserRewards(userId);
  const multiplier = TIER_MULTIPLIERS[rewards.tier as keyof typeof TIER_MULTIPLIERS];
  const pointsToAdd = Math.floor(amount * POINTS_PER_PESO * multiplier);

  rewards.totalPoints += pointsToAdd;
  rewards.currentPoints += pointsToAdd;
  rewards.lastUpdated = new Date();

  updateTier(rewards);
  return rewards;
}

export function usePoints(userId: string, amount: number): UserRewards {
  const rewards = getUserRewards(userId);
  if (rewards.currentPoints < amount) {
    throw new Error("Insufficient points");
  }
  rewards.currentPoints -= amount;
  rewards.pointsUsed += amount;
  rewards.lastUpdated = new Date();
  return rewards;
}

export function updateTier(rewards: UserRewards): void {
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

export function addBirthdayBonus(userId: string): UserRewards {
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

export function resetBirthdayBonus(): void {
  const today = new Date();
  rewardsDB.forEach((rewards) => {
    if (rewards.birthDate) {
      const birthday = new Date(rewards.birthDate);
      birthday.setFullYear(today.getFullYear());

      if (
        today.getMonth() === birthday.getMonth() &&
        today.getDate() === birthday.getDate()
      ) {
        rewards.birthdayBonusEligible = true;
      }
    }
  });
}

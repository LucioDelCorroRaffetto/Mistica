import { useState, useEffect } from "react";
import "./RewardsPanel.css";

interface RewardsData {
  currentPoints: number;
  tier: string;
  totalPoints: number;
  pointsUsed: number;
}

interface RewardsPanelProps {
  userId?: string;
}

export function RewardsPanel({ userId = "user-001" }: RewardsPanelProps) {
  const [rewards, setRewards] = useState<RewardsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRewards();
  }, [userId]);

  const loadRewards = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/rewards?userId=${userId}`);
      const data = await response.json();
      setRewards(data);
    } catch (error) {
      console.error("Error loading rewards:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !rewards) {
    return <div className="rewards-panel loading">Cargando rewards...</div>;
  }

  const tierColors: Record<string, string> = {
    bronze: "#CD7F32",
    silver: "#C0C0C0",
    gold: "#FFD700",
    platinum: "#E5E4E2",
  };

  const tierNames: Record<string, string> = {
    bronze: "Bronce",
    silver: "Plata",
    gold: "Oro",
    platinum: "Platino",
  };

  return (
    <div className="rewards-panel">
      <div className="rewards-header">
        <h3>🎁 Mis Rewards</h3>
        <span className="tier-badge" style={{ backgroundColor: tierColors[rewards.tier] }}>
          {tierNames[rewards.tier]}
        </span>
      </div>

      <div className="rewards-points">
        <div className="points-display">
          <span className="points-value">{rewards.currentPoints}</span>
          <span className="points-label">Puntos Disponibles</span>
        </div>
        <div className="points-progress">
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{
                width: `${(rewards.currentPoints / (rewards.totalPoints || 1)) * 100}%`,
              }}
            ></div>
          </div>
          <span className="progress-text">
            {rewards.totalPoints - rewards.pointsUsed} de {rewards.totalPoints} puntos totales
          </span>
        </div>
      </div>

      <div className="rewards-info">
        <div className="info-item">
          <span className="info-label">Puntos Invertidos</span>
          <span className="info-value">{rewards.pointsUsed}</span>
        </div>
        <div className="info-item">
          <span className="info-label">Próximo Tier</span>
          <span className="info-value">+{Math.max(0, 2500 - rewards.totalPoints)}</span>
        </div>
      </div>

      <div className="rewards-benefits">
        <p className="benefits-title">Beneficios {tierNames[rewards.tier]}:</p>
        <ul>
          <li>✓ 1 punto = $1 gastado</li>
          <li>✓ Multiplicador: {rewards.tier === "platinum" ? "1.5x" : rewards.tier === "gold" ? "1.25x" : rewards.tier === "silver" ? "1.1x" : "1x"}</li>
          <li>✓ Bonificación en cumpleaños</li>
          <li>✓ Descuentos exclusivos</li>
        </ul>
      </div>
    </div>
  );
}

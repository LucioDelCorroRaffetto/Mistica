import { useState } from "react";
import "./CouponInput.css";

interface CouponInputProps {
  onApply: (discount: number) => void;
  purchaseAmount: number;
}

export function CouponInput({ onApply, purchaseAmount }: CouponInputProps) {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [appliedCode, setAppliedCode] = useState("");

  const handleApply = async () => {
    if (!code.trim()) {
      setMessage("Ingresa un código de cupón");
      setIsError(true);
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("http://localhost:3000/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, purchaseAmount }),
      });

      const data = await response.json();

      if (data.isValid) {
        setMessage(`¡Cupón aplicado! Descuento: $${data.discount}`);
        setIsError(false);
        setAppliedCode(code);
        onApply(data.discount);
        setCode("");
      } else {
        setMessage(data.message);
        setIsError(true);
      }
    } catch (error) {
      setMessage("Error al validar el cupón");
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="coupon-input">
      <h4>Código de Cupón</h4>
      <div className="coupon-form">
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder="Ingresa tu código"
          disabled={!!appliedCode}
          className="coupon-code-input"
        />
        <button
          onClick={handleApply}
          disabled={loading || !!appliedCode}
          className="btn btn-primary btn-sm"
        >
          {loading ? "..." : "Aplicar"}
        </button>
      </div>

      {message && (
        <div className={`coupon-message ${isError ? "error" : "success"}`}>
          {message}
        </div>
      )}

      {appliedCode && (
        <div className="coupon-applied">
          <span>Cupón aplicado: <strong>{appliedCode}</strong></span>
          <button
            onClick={() => {
              setAppliedCode("");
              setCode("");
              setMessage("");
              onApply(0);
            }}
            className="btn-remove"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}

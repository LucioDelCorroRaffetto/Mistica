import type { PropsWithChildren } from "react";
import "../index.css";

export type ButtonProps = PropsWithChildren<{
  variant?: "default" | "abort" | "confirm";
}>;

export function Button({ children, variant }: ButtonProps) {
  let variantClass = "";
  switch (variant) {
    case "abort":
      variantClass = "bg-gradient-to-r from-red-500 to-pink-500 text-white hover:from-red-600 hover:to-pink-600 shadow-md";
      break;
    case "confirm":
      variantClass = "bg-gradient-to-r from-green-500 to-teal-500 text-white hover:from-green-600 hover:to-teal-600 shadow-md";
      break;
    default:
      variantClass = "bg-gradient-to-r from-gray-200 to-gray-400 text-black hover:from-gray-300 hover:to-gray-500 shadow-md";
      break;
  }
  return (
    <button
      className={`border-none px-5 py-2 rounded-lg font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-pink-400 ${variantClass}`}
    >
      {children}
    </button>
  );
}

export default Button;
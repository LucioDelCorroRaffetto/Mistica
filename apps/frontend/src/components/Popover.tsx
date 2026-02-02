import { useState, useRef, useEffect } from "react";
import "./Popover.css";

interface PopoverProps {
  content: React.ReactNode;
  children: React.ReactNode;
  position?: "top" | "bottom" | "left" | "right";
}

export default function Popover({
  content,
  children,
  position = "bottom",
}: PopoverProps) {
  const [visible, setVisible] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setVisible(false);
      }
    }

    if (visible) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [visible]);

  return (
    <div className="popover-wrapper" ref={wrapperRef}>
      <div onClick={() => setVisible(!visible)}>{children}</div>
      {visible && (
        <div className={`popover popover-${position}`}>{content}</div>
      )}
    </div>
  );
}

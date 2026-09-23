import type { StateId } from "../types";
import { useRef } from "react";

type Props = {
  label?: string;
  id: number;
  isFinal?: boolean;
  isSelected: boolean;
  x: number;
  y: number;
  onSelect: (id: StateId) => void;
  onMoveState: (id: StateId, x: number, y: number) => void;
};

export default function State({
  label,
  id,
  isSelected,
  isFinal = false,
  x = 50,
  y = 50,
  onSelect,
  onMoveState,
}: Props) {
  let strokeWidth = "3";
  if (isFinal) {
    strokeWidth = "6";
  }

  let fill = "white";
  if (isSelected) {
    fill = "blue";
  }

  const xRef = useRef(0);
  const yRef = useRef(0);
  const moveRef = useRef(false);
  function handleBeginMove(e: React.PointerEvent<SVGCircleElement>) {
    moveRef.current = true;
    xRef.current = x - e.clientX;
    yRef.current = y - e.clientY;
    e.currentTarget.setPointerCapture(e.pointerId);
    onSelect(id);
  }

  function handleMove(e: React.PointerEvent<SVGCircleElement>) {
    if (moveRef.current) {
      onMoveState(id, e.clientX + xRef.current, e.clientY + yRef.current);
    }
  }

  function handleEndMove(e: React.PointerEvent<SVGCircleElement>) {
    moveRef.current = false;
    e.currentTarget.releasePointerCapture(e.pointerId);
  }

  return (
    <circle
      r="40"
      cx={x}
      cy={y}
      fill={fill}
      stroke="black"
      strokeWidth={strokeWidth}
      onPointerDown={handleBeginMove}
      onPointerMove={handleMove}
      onPointerUp={handleEndMove}
    />
  );
}

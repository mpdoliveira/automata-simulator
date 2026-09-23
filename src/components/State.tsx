import type { StateId } from "../types";
import { useRef, useState } from "react";

type Props = {
  label?: string;
  id: number;
  isFinal?: boolean;
  isSelected?: boolean;
  x?: number;
  y?: number;
  onSelect: (id: StateId) => void;
  onMoveState: (id: StateId, x: number, y: number) => void;
  size?: number;
};

export default function State({
  label,
  id,
  onSelect,
  onMoveState,
  isSelected = false,
  isFinal = false,
  x = 50,
  y = 50,
  size = 30,
}: Props) {
  let strokeWidth = "3";
  if (isFinal) {
    strokeWidth = "6";
  }

  let fill = "white";
  if (isSelected) {
    fill = "blue";
  }

  const outerSize = size + 10;

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

  const [isHovered, setHovered] = useState(false);
  function handleHover() {
    setHovered(true);
  }

  function handleEndHover() {
    setHovered(false);
  }
  return (
    <g
      onPointerEnter={handleHover}
      onPointerLeave={handleEndHover}>
      <circle
        r={outerSize}
        fill="transparent"
        cx={x}
        cy={y}
      />
      <circle
        r={size}
        cx={x}
        cy={y}
        fill={fill}
        stroke="black"
        strokeWidth={strokeWidth}
        onPointerDown={handleBeginMove}
        onPointerMove={handleMove}
        onPointerUp={handleEndMove}
      />
      {isHovered && !moveRef.current && (
        <>
          <circle r="4" cx={x} cy={y + outerSize} />
          <circle r="4" cx={x + outerSize} cy={y} />
          <circle r="4" cx={x} cy={y - outerSize} />
          <circle r="4" cx={x - outerSize} cy={y} />
        </>
      )}
    </g>
  );
}

import type { Position, StateId } from "../types";
import { useRef, useState } from "react";

type Props = {
  label?: string;
  id: number;
  isFinal?: boolean;
  isSelected?: boolean;
  position: Position;
  onSelect: (id: StateId) => void;
  onMoveState: (id: StateId, position : Position) => void;
  size?: number;
};


export default function State({
  label,
  id,
  position,
  onSelect,
  onMoveState,
  isSelected = false,
  isFinal = false,
  size = 30,
}: Props) {

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
    xRef.current = position.x - e.clientX;
    yRef.current = position.y - e.clientY;
    e.currentTarget.setPointerCapture(e.pointerId);
    onSelect(id);
  }

  function handleMove(e: React.PointerEvent<SVGCircleElement>) {
    if (moveRef.current) {
      const newPosition = {
        x : e.clientX + xRef.current,
        y : e.clientY + yRef.current
      }
      onMoveState(id, newPosition);
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
    <g onPointerEnter={handleHover} onPointerLeave={handleEndHover}>
      <circle r={outerSize} fill="transparent" cx={position.x} cy={position.y} />
      <g
        onPointerDown={handleBeginMove}
        onPointerMove={handleMove}
        onPointerUp={handleEndMove}
      >
        <circle
          r={size}
          cx={position.x}
          cy={position.y}
          fill={fill}
          stroke="black"
          strokeWidth="1"
        />
        {isFinal && (
          <circle
            r={size - 10}
            cx={position.x}
            cy={position.y}
            fill={fill}
            stroke="black"
            strokeWidth="1"
          />
        )}
      </g>
      <text x={position.x} y={position.y}>
        {label}
      </text>
      {isHovered && !moveRef.current && (
        <>
          <circle r="4" cx={position.x} cy={position.y + outerSize} />
          <circle r="4" cx={position.x + outerSize} cy={position.y} />
          <circle r="4" cx={position.x} cy={position.y - outerSize} />
          <circle r="4" cx={position.x - outerSize} cy={position.y} />
        </>
      )}
    </g>
  );
}

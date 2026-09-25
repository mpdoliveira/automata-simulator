import type { Position } from "../types";

type Props = {
  sourcePosition: Position;
  symbol?: string;
  targetPosition: Position;
};

export default function Transition({
  sourcePosition,
  symbol = "",
  targetPosition,
}: Props) {
  const deltaX = targetPosition.x - sourcePosition.x;
  const deltaY = targetPosition.y - sourcePosition.y;

  const midPosition = {
    x: (sourcePosition.x + targetPosition.x) / 2,
    y: (sourcePosition.y + targetPosition.y) / 2,
  }

  const distance = Math.sqrt(
    Math.pow(deltaX, 2) 
    + Math.pow(deltaY, 2),
  );

  const unitX = deltaX / distance;
  const unitY = deltaY / distance;

  const offsetX = unitX * 30;
  const offsetY = unitY * 30;

  const sourceEdgePosition = {
    x: sourcePosition.x + offsetX,
    y: sourcePosition.y + offsetY,
  }

  const targetEdgePosition = {
    x: targetPosition.x - offsetX,
    y: targetPosition.y - offsetY,
  }

  return (
    <>
      <marker
        id="arrow"
        viewBox="0 0 10 10"
        refX="10"
        refY="5"
        markerWidth="6"
        markerHeight="6"
        orient="auto-start-reverse"
      ><path d="M 0 0 L 10 5 L 0 10 z" /></marker>
      <path
        d={`M${sourceEdgePosition.x},${sourceEdgePosition.y} L${targetEdgePosition.x},${targetEdgePosition.y}`}
        stroke="black"
        strokeWidth="2"
        markerEnd="url(#arrow)"
      />
      <text x={midPosition.x} y={midPosition.y}>{symbol}</text>
    </>
  );
}

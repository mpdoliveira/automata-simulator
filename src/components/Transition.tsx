import type { Position } from "../types";

type Props = {
  sourcePosition: Position;
  symbol: string;
  targetPosition: Position;
};

export default function Transition({
  sourcePosition,
  symbol,
  targetPosition,
}: Props) {
  return (
    <>
      <path
        d={`M${sourcePosition.x},${sourcePosition.y} L${targetPosition.x},${targetPosition.y}`}
        stroke="black"
        strokeWidth="2"
      />
      <marker id="arrow" refX="40" refY="40" />
    </>
  );
}

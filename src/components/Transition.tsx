import type { Position } from "../types";

type Props = {
  sourcePosition?: Position;
  symbol?: string;
  targetPosition : Position;
  onUpdateSymbols : Function;
};

export default function Transition({
  sourcePosition,
  symbol = "",
  targetPosition,
  onUpdateSymbols
}: Props) {
  if (!sourcePosition) {
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
        >
          <path d="M 0 0 L 10 5 L 0 10 z" />
        </marker>
        <path
          d={`M${targetPosition.x -80},${targetPosition.y} L${targetPosition.x - 30},${targetPosition.y}`}
          stroke="black"
          strokeWidth="2"
          markerEnd="url(#arrow)"
        />
      </>
    )
  }

  if (symbol=="") {
    symbol="ε";
  }

  if (
    sourcePosition.x === targetPosition.x &&
    sourcePosition.y === targetPosition.y
  ) {

    const offset = 30 / Math.sqrt(2);
    
    const loopSourcePosition = {
      x: sourcePosition.x - offset,
      y: sourcePosition.y - offset
    }

    const loopTargetPosition = {
      x: targetPosition.x + offset,
      y: targetPosition.y - offset
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
        >
          <path d="M 0 0 L 10 5 L 0 10 z" />
        </marker>
        <path
          d={`
            M ${loopSourcePosition.x} ${loopSourcePosition.y}
            A 30 30 0 1 1
              ${loopTargetPosition.x} ${loopTargetPosition.y}
          `}
          fill="none"
          stroke="black"
          strokeWidth="2"
          markerEnd="url(#arrow)"
        />
        <foreignObject
          x={sourcePosition.x - 40}
          y={sourcePosition.y - 80}
          width={80}
          height={30}
        >
          <input
            type="text"
            onChange={(e) => onUpdateSymbols(e.target.value)}
            defaultValue={symbol}
          />
        </foreignObject>
      </>
    )
  }

  const deltaX = targetPosition.x - sourcePosition.x;
  const deltaY = targetPosition.y - sourcePosition.y;

  const midPosition = {
    x: (sourcePosition.x + targetPosition.x) / 2,
    y: (sourcePosition.y + targetPosition.y) / 2,
  };

  const distance = Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2));

  const unitX = deltaX / distance;
  const unitY = deltaY / distance;

  const offsetX = unitX * 30;
  const offsetY = unitY * 30;

  const sourceEdgePosition = {
    x: sourcePosition.x + offsetX,
    y: sourcePosition.y + offsetY,
  };

  const targetEdgePosition = {
    x: targetPosition.x - offsetX,
    y: targetPosition.y - offsetY,
  };

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
      >
        <path d="M 0 0 L 10 5 L 0 10 z" />
      </marker>
      <path
        d={`M${sourceEdgePosition.x},${sourceEdgePosition.y} L${targetEdgePosition.x},${targetEdgePosition.y}`}
        stroke="black"
        strokeWidth="2"
        markerEnd="url(#arrow)"
      />
      <foreignObject
        x={midPosition.x - 40}
        y={midPosition.y - 15}
        width={80}
        height={30}
      >
        <input
          type="text"
          defaultValue={symbol}
          placeholder="ε"
          onChange={(e) => onUpdateSymbols(e.target.value)}
        />
      </foreignObject>
    </>
  );
}

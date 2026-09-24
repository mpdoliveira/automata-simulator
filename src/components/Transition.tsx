type Props = {
  sourcePosition: {x: number, y: number};
  symbol: string;
  targetPosition: {x: number, y: number};
};

export default function Transition({
  sourcePosition,
  symbol,
  targetPosition
}: Props) {
  return (
    <>
      <path
        d={"M".concat(
          sourcePosition.x.toString(),
          ",",
          sourcePosition.y.toString(),
          "L",
          targetPosition.x.toString(),
          ",",
          targetPosition.y.toString(),
        )}
        stroke="black"
      />
      <marker id="arrow" refX="40" refY="40" />
    </>
  );
}

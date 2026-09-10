import type { StateId } from "../types"

type Props = {
  label?: string;
  id: number;
  isFinal?: boolean;
  isSelected: boolean;
  xCenter: string | number;
  onSelect: (id : StateId) => void;
};

export default function State({
  label,
  id,
  isFinal = false,
  isSelected,
  xCenter = "50",
  onSelect: onSelect,
}: Props) {
  let strokeWidth = "3";

  let fill = "white";

  if (isFinal) {
    strokeWidth = "6";
  }

  if (isSelected) {
    fill = "blue"
  }

  return (
    <circle
      r="40"
      cx={xCenter}
      cy="50"
      fill={fill}
      stroke="black"
      stroke-width={strokeWidth}
      onClick={() => onSelect(id)}
    />
  );
}

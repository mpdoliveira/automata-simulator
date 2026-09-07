type Props = {
    label?: string,
    id : number,
    isFinal?: boolean,
    xCenter : string | number,
    onClick: () => void,
}

export default function State(
    {
        label,
        id,
        isFinal = false,
        xCenter = "50",
        onClick
    } : Props
)
{
  let strokeWidth = "3";

  if (isFinal) {
    strokeWidth = "6";
  }

  return (
    <circle
      r="40"
      cx={xCenter}
      cy="50"
      fill="white"
      stroke="black"
      stroke-width={strokeWidth}
      onClick={onClick}
    />
  );
}

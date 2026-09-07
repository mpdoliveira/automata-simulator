export default function Button(props: { name: string; onClick: () => void }) {
  return <button onClick={props.onClick}>{props.name}</button>;
}

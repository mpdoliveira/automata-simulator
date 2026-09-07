import { useState } from "react";

import { initAutomaton, addState } from "./engine/operations";
import type { Automaton } from "./types";

function Button(
  props: { 
    name : string,
    onClick: () => void
  }) {
  return <button onClick={props.onClick}>{props.name}</button>;
}

function List(props: { items: String[] }) {
  return (
    <>
      <ul>
        {props.items.map((item) => (
          <li>{item}</li>
        ))}
      </ul>
    </>
  );
}

function stateNames(automaton: Automaton): String[] {
  const names = [];
  for (const state of automaton.states.values()) {
    names.push(state.label);
  }

  return names;
}

export default function App() {
  const [automaton, setAutomaton] = useState(initAutomaton());

  function handleAddState() {
    setAutomaton(addState(automaton, "test"));
  }

  return (
    <>
      <Button name="+ State" onClick={handleAddState}/>
      <List items={stateNames(automaton)} />
    </>
  );
}

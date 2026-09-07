import { useState } from "react";

import { initAutomaton, addState, rmState } from "./engine/operations";
import type { Automaton, StateId } from "./types";

import Button from "./components/Button.tsx";

function stateNames(automaton: Automaton): String[] {
  const names = [];
  for (const state of automaton.states.values()) {
    names.push(state.label);
  }

  return names;
}

export default function App() {
  const [automaton, setAutomaton] = useState(initAutomaton());

  const [clicked, setClicked] = useState(new Set());

  function handleItemClick(id: StateId) {
    let temp = clicked;

    if (clicked.has(id)) {
      temp.delete(id);
      setClicked(temp);
    } else {
      temp.add(id);
      setClicked(temp);
    }
  }

  function handleAddState() {
    setAutomaton(addState(automaton));
  }

  return (
    <>
      <Button name="+ State" onClick={handleAddState} />
    </>
  );
}

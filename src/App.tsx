import { useState } from "react";

import { initAutomaton, addState, rmState } from "./engine/operations";
import type { Automaton, StateId } from "./types";

import Button from "./components/Button.tsx";
import State from "./components/State.tsx";

function stateNames(automaton: Automaton): string[] {
  const names = [];
  for (const state of automaton.states.values()) {
    names.push(state.label);
  }

  return names;
}

export default function App() {
  const [automaton, setAutomaton] = useState(initAutomaton());

  function handleAddState() {
    setAutomaton(addState(automaton));
  }

  return (
    <>
      <Button name="+ State" onClick={handleAddState} />
      <svg width="1000" height="1000">
        {stateNames(automaton).map((state, index) => (
          <State
            label={state}
            id={index}
            xCenter={String(100 * index)}
            onClick={() => console.log("HEY")}
          />
        ))}
      </svg>
    </>
  );
}

import { useState } from "react";

import {
  initAutomaton,
  addState,
  rmState,
  rmTransition,
} from "./engine/operations";
import type { Automaton, State, StateId, Transition } from "./types";

import Button from "./components/Button.tsx";
import Canvas from "./components/canvas.tsx";

export default function App() {
  const [automaton, setAutomaton] = useState(initAutomaton());

  const [selectedStates, setSelectedStates] = useState(new Set<StateId>());
  const [selectedTransitions, setSelectedTransitions] = useState(
    new Set<Transition>(),
  );

  function handleAddState() {
    setAutomaton(addState(automaton));
  }

  function handleSelectState(id: StateId) {
    let newSelectedStates = new Set(selectedStates);
    if (selectedStates.has(id)) {
      newSelectedStates.delete(id);
      setSelectedStates(newSelectedStates);
    } else {
      newSelectedStates.add(id);
      setSelectedStates(newSelectedStates);
    }
  }

  function handleDelete() {
    for (const id of selectedStates) {
      setAutomaton(rmState(automaton, id));
    }
    for (const transition of selectedTransitions) {
      setAutomaton(
        rmTransition(
          automaton,
          transition.source,
          transition.symbol,
          transition.target,
        ),
      );
    }
    setSelectedStates(new Set<StateId>());
    setSelectedTransitions(new Set<Transition>());
  }

  return (
    <>
      <Button name="+ State" onClick={handleAddState} />
      <Canvas
        automaton={automaton}
        selectedStates={selectedStates}
        onSelect={handleSelectState}
        onDelete={handleDelete}
      />
    </>
  );
}

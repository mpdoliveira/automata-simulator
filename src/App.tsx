import { useState } from "react";

import {
  initAutomaton,
  addState,
  rmState,
  rmTransition,
  mvState,
  addTransition,
  getLastState,
} from "./engine/operations";
import type { Position, StateId, Transition, Symbol } from "./types";

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

  function handleMoveState(id: StateId, position: Position) {
    setAutomaton(mvState(automaton, id, position));
  }

  function handleAddTransition(sourceId: StateId, targetId: StateId) {
    setAutomaton(addTransition(automaton, sourceId, "a", targetId));
  }

  function handleQuickAdd(sourceId: StateId) {
    {
      setAutomaton(addState(automaton));
      setAutomaton((previous) =>
        addTransition(previous, sourceId, "a", getLastState(previous)),
      );
    }
  }

  return (
    <>
      <Button name="+ State" onClick={handleAddState} />
      <Canvas
        automaton={automaton}
        selectedStates={selectedStates}
        onSelect={handleSelectState}
        onDelete={handleDelete}
        onMoveState={handleMoveState}
        onAddTransition={handleAddTransition}
        onQuickAdd={handleQuickAdd}
      />
    </>
  );
}

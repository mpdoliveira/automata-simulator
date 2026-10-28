import { useState, useRef } from "react";

// Engine functions
import {
  initAutomaton,
  addState,
  rmState,
  rmTransition,
  mvState,
  addTransition,
  getLastState,
  makeFinal,
  makeInitial,
  upTransitionSymbols,
} from "./engine/operations";
import { runWord } from "./engine/execution.ts";

// Components
import Button from "./components/Button.tsx";
import Canvas from "./components/canvas.tsx";

// Types
import type { Position, StateId, Transition, Symbol } from "./types";

export default function App() {
  const [automaton, setAutomaton] = useState(initAutomaton());

  // Canvas manipulation

  const [selectedStates, setSelectedStates] = useState(new Set<StateId>());
  
  const [selectedTransitions, setSelectedTransitions] = useState(
    new Set<Transition>(),
  );

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

  // State manipulation

  function handleMakeFinal(stateId: StateId) {
    setAutomaton(makeFinal(automaton, stateId));
  }

  function handleMakeInitial() {
    setAutomaton(makeInitial(automaton, 0));
  }

  function handleMoveState(id: StateId, position: Position) {
    setAutomaton(mvState(automaton, id, position));
  }

  function handleAddState() {
    setAutomaton(addState(automaton));
  }

  // Transition manipulation

  function handleAddTransition(sourceId: StateId, targetId: StateId) {
    setAutomaton(addTransition(automaton, sourceId, "", targetId));
  }

  function handleQuickAdd(sourceId: StateId) {
    {
      setAutomaton(addState(automaton));
      setAutomaton((previous) =>
        addTransition(previous, sourceId, "", getLastState(previous)),
      );
    }
  }

  function handleUpdateSymbols(
    sourceId: StateId,
    targetId: StateId,
    symbols: Symbol,
  ) {
    setAutomaton((previous) =>
      upTransitionSymbols(
        previous,
        sourceId,
        targetId,
        new Set(
          symbols
            .split(",")
            .map((symbol) => symbol.trim())
            .filter(Boolean),
        ),
      ),
    );
  }

  // Run word

  const wordRef = useRef<string>("");

  function handleRunWord() {
    console.log(wordRef.current);
    console.log(automaton.finalStates);
    console.log(automaton.initialStates);
    const runResult = runWord(automaton, wordRef.current);
    console.log(runResult.accepted);
    console.table(runResult.steps);
  }

  return (
    <>
      <input
        onChange={(e) => {
          wordRef.current = e.target.value;
        }}
      />
      <Button name="Run" onClick={handleRunWord} />
      <Button name="+ State" onClick={handleAddState} />
      <Button name="+ Initial" onClick={handleMakeInitial} />
      <Canvas
        automaton={automaton}
        selectedStates={selectedStates}
        onSelect={handleSelectState}
        onDelete={handleDelete}
        onMoveState={handleMoveState}
        onAddTransition={handleAddTransition}
        onQuickAdd={handleQuickAdd}
        onMakeFinal={handleMakeFinal}
        onUpdateSymbols={handleUpdateSymbols}
      />
    </>
  );
}

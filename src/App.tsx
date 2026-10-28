import { useEffect, useState, useRef } from "react";

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
  getCombinedTransitions,
} from "./engine/operations";
import type { Position, StateId, Transition, Symbol } from "./types";

import Button from "./components/Button.tsx";
import Canvas from "./components/canvas.tsx";
import { runWord } from "./engine/execution.ts";

export default function App() {
  const [automaton, setAutomaton] = useState(initAutomaton());

  useEffect(() => {
      console.table(getCombinedTransitions(automaton)),
      [automaton]
    })

  const [selectedStates, setSelectedStates] = useState(new Set<StateId>());
  const [selectedTransitions, setSelectedTransitions] = useState(
    new Set<Transition>(),
  );

  const wordRef = useRef<string>("");

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

  function handleMakeFinal(stateId: StateId) {
    setAutomaton(makeFinal(automaton, stateId));
  }

  function handleMakeInitial() {
    setAutomaton(makeInitial(automaton, 0));
  }

  function handleUpdateSymbols(
    sourceId: StateId,
    targetId: StateId,
    symbols: Symbol,
  ) {
    console.log("updating tarnsition");
    setAutomaton(
      (previous) => upTransitionSymbols(
        automaton,
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

  function handleRunWord() {
    const runResult = runWord(automaton, wordRef.current);
    console.log(runResult.accepted);
  }

  return (
    <>
      <input onChange={(e) => {wordRef.current = e.target.value}} />
      <Button name="Run" onClick={handleRunWord}/>
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

import { useState } from "react";

import { initAutomaton, addState, rmState } from "./engine/operations";
import type { Automaton, StateId } from "./types";

import Button from "./components/Button.tsx";
import Canvas from "./components/canvas.tsx";

export default function App() {
  const [automaton, setAutomaton] = useState(initAutomaton());

  const [selectedStates, setSelected] = useState(new Set<StateId>)

  function handleAddState() {
    setAutomaton(addState(automaton));
  }

  function handleSelectState(id : StateId) {
    let newSelectedStates = new Set(selectedStates);
    if (selectedStates.has(id)) {
      newSelectedStates.delete(id);
      setSelected(newSelectedStates);
    }
    else {
      newSelectedStates.add(id) 
        setSelected(newSelectedStates);
    }
  }

  return (
    <>
      <Button name="+ State" onClick={handleAddState} />
      <Canvas automaton={automaton} selectedStates={selectedStates} onSelect={handleSelectState}/>
    </>
  );
}

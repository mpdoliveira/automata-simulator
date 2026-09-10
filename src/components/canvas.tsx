import type { Automaton, StateId } from "../types.tsx";

import State from "./State.tsx";

type Props = {
  automaton: Automaton;
  selectedStates: Set<StateId>;
  onSelect: (id : StateId) => void;
};

function _() {}

export default function Canvas({ automaton, selectedStates, onSelect}: Props) {
  return (
    <svg width="100%" height="70%">
      {Array.from(automaton.states).map(([stateId, state]) => (
        <State
          label={state.label}
          id={stateId}
          isFinal={automaton.finalStates.has(stateId)}
          isSelected={selectedStates.has(stateId)}
          xCenter={stateId * 100 + 50}
          onSelect={onSelect}
        />
      ))}
    </svg>
  );
}

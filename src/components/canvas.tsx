import {} from "react";

import type { Automaton, Position, StateId } from "../types.tsx";

import State from "./State.tsx";
import Transition from "./Transition.tsx";
import { getPosition, getTransitions, getStates } from "../engine/operations.ts";

type Props = {
  automaton: Automaton;
  selectedStates: Set<StateId>;
  onSelect: (id: StateId) => void;
  onDelete: () => void;
  onMoveState: (id: StateId, position: Position) => void;
};


export default function Canvas({
  automaton,
  selectedStates,
  onSelect,
  onDelete,
  onMoveState,
}: Props) {

  function handleKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key === "Delete") {
      onDelete();
    }
  }
  
  return (
    <div tabIndex={0} onKeyDown={handleKeyDown}>
      <svg width="100%" height="70%">
        {getTransitions(automaton).map((transition) => (
          <Transition
            sourcePosition={getPosition(automaton, transition.source)}
            symbol={transition.symbol}
            targetPosition={getPosition(automaton, transition.target)}
          />
        ))}
        {getStates(automaton).map(([stateId, state]) => (
          <>
            <State
              label={state.label}
              id={stateId}
              isFinal={automaton.finalStates.has(stateId)}
              isSelected={selectedStates.has(stateId)}
              position={getPosition(automaton, stateId)}
              onSelect={onSelect}
              onMoveState={onMoveState}
            />
          </>
        ))}
      </svg>
    </div>
  );
}

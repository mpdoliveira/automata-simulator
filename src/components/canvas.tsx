import { useRef } from "react";

import type { Automaton, Position, StateId, Symbol } from "../types.tsx";

import State from "./State.tsx";
import Transition from "./Transition.tsx";
import {
  getPosition,
  getTransitions,
  getStates
} from "../engine/operations.ts";

type Props = {
  automaton: Automaton;
  selectedStates: Set<StateId>;
  onSelect: Function;
  onDelete: Function;
  onMoveState: Function;
  onAddTransition: Function;
  onQuickAdd: Function;
  onMakeFinal: Function;
};

export default function Canvas({
  automaton,
  selectedStates,
  onSelect,
  onDelete,
  onMoveState,
  onAddTransition,
  onQuickAdd,
  onMakeFinal,
}: Props) {
  function handleKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key === "Delete") {
      onDelete();
    }
  }

  const sourceIdRef = useRef<StateId | null>(null);

  function handleTransitionStart(stateId: StateId) {
    sourceIdRef.current = stateId;
  }

  function handleTransitionEnd(targetId: StateId) {
    if (sourceIdRef.current != null) {
      onAddTransition(sourceIdRef.current, targetId);
      sourceIdRef.current = null;
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
          <State
            label={state.label}
            id={stateId}
            isFinal={automaton.finalStates.has(stateId)}
            isSelected={selectedStates.has(stateId)}
            position={getPosition(automaton, stateId)}
            onSelect={onSelect}
            onMoveState={onMoveState}
            onTransitionStart={handleTransitionStart}
            onTransitionEnd={handleTransitionEnd}
            onQuickAdd={onQuickAdd}
            onMakeFinal={onMakeFinal}
          />
        ))}
      </svg>
    </div>
  );
}

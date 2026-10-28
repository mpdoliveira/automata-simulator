import { useRef } from "react";

import type { Automaton, StateId } from "../types.tsx";

import State from "./State.tsx";
import Transition from "./Transition.tsx";
import {
  getPosition,
  getCombinedTransitions,
  getStates,
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
  onUpdateSymbols: Function;
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
  onUpdateSymbols,
}: Props) {

  function handleKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key === "Delete") {
      onDelete();
    }
  }

  const sourceIdRef = useRef<StateId | null>(null);

  function handleTransitionStart(sourceId: StateId) {
    sourceIdRef.current = sourceId;
  }

  function handleTransitionEnd(targetId: StateId) {
    onAddTransition(sourceIdRef.current, targetId);
  }

  return (
    <div tabIndex={0} onKeyDown={handleKeyDown}>
      <svg width="100%" height="70%">
        {getCombinedTransitions(automaton).map((transition) => (
          <Transition
            sourcePosition={getPosition(automaton, transition.source)}
            symbol={transition.symbol}
            targetPosition={getPosition(automaton, transition.target)}
            onUpdateSymbols={(symbols : string) =>
              onUpdateSymbols(
                transition.source,
                transition.target,
                symbols,
              )
            }
          />
        ))}
        {Array.from(automaton.initialStates).map((stateId) => (
          <Transition
            targetPosition={getPosition(automaton, stateId)}
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

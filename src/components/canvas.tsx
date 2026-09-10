import type { Automaton, StateId } from "../types.tsx";

import State from "./State.tsx";

type Props = {
  automaton: Automaton;
  selectedStates: Set<StateId>;
};

function _ () {
}

export default function Canvas({ automaton, selectedStates }: Props) {
    return (
        <svg width="100%" height="70%">
            {Array.from(automaton.states).map( ([stateId, state]) => (
                <State label={state.label} id={stateId} xCenter={stateId * 100 + 50} onClick={_} />
            ))}
        </svg>
    )
}

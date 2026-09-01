import type {
    Automaton,
    State,
    StateId, 
    Symbol
} from "../types.ts";

export function initAutomaton (
    name : string = "Default",
    alphanet?: Set<Symbol>,
    states : Map<StateId, State> = new Map<StateId, State>(),
    initialStates : Set<StateId> = new Set<StateId>(),
    finalStates : Set<StateId> = new Set<StateId>()
) : Automaton {

    let nextId = 0;
    for (const id of states.keys())  {
        if (id >= nextId) {
            nextId = id + 1;
        }
    }

    return {
        name: name,
        alphabet: alphanet,
        states: states,
        nextId: nextId,
        initialStates: initialStates,
        finalStates: finalStates
    }
}

export function addState(
    automaton : Automaton = initAutomaton(),
    label?: string
) {
    const newStates = new Map(automaton.states);

    const currId = automaton.nextId;

    if (!label) {
        label = "q" + currId
    }

    newStates.set(
        currId, 
        {
            label: label,
            transitions: new Map<Symbol, Set<StateId>>()
        }
    )

    return {
        ...automaton,
        states: newStates,
        nextId: currId + 1
    }
}
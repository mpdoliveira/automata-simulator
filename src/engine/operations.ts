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
        // Possibly add a default label function to allow config preference
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


export function rmState (
    automaton : Automaton,
    rmId : number
): Automaton {

    if (!automaton.states.has(rmId)) {
        return automaton;
    }

    const newStates = automaton.states;

    newStates.delete(rmId);

    for (const [id, state] of newStates) {
        const newTransitions = new Map(state.transitions);

        for (const [symbol, targets] of newTransitions) {
            const newTargets = new Set(targets)
            
            if (targets.has(rmId)) {
                newTargets.delete(rmId);

                newTransitions.set(
                    symbol,
                    newTargets
                );
            }
        }

        newStates.set(
            id,
            {
                ...state,
                transitions: newTransitions
            }
        )
    }

    const newInitialStates = new Set(automaton.initialStates)
    newInitialStates.delete(rmId);

    const newFinalStates = new Set(automaton.finalStates)
    newFinalStates.delete(rmId)

    return {
        ...automaton,
        states: newStates,
        initialStates: newInitialStates,
        finalStates: newFinalStates
    };
}


export function addTransition(
    automaton : Automaton,
    sourceId : StateId,
    symbol : Symbol,
    targetId : StateId
): Automaton {
    if (automaton.alphabet && !automaton.alphabet.has(symbol)) {
        return automaton;
    }

    if (!automaton.states.has(sourceId) || !automaton.states.has(targetId)) {
        return automaton;
    }

    const newStates = new Map(
        automaton.states
    );

    const newState = {
        ...newStates.get(sourceId)!
    };

    const newTransitions = new Map(
        newState.transitions
    );
    
    const newTargets = new Set<StateId>(
        newTransitions.get(symbol) ?? []
    );

    newTargets.add(targetId);

    newTransitions.set(
        symbol,
        newTargets
    );

    newState.transitions = newTransitions;

    newStates.set(
        sourceId,
        newState
    );

    return {
        ...automaton,
        states: newStates
    }
}
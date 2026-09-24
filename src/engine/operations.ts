import type {
    Automaton,
    State,
    StateId, 
    Symbol,
    Transition,
    Position
} from "../types.ts";


export function initAutomaton (
    name : string = "Default",
    alphanet?: Set<Symbol>,
    states : Map<StateId, State> = new Map<StateId, State>(),
    statePositions : Map<StateId, Position> = new Map<StateId, Position>(),
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
        statePositions: statePositions,
        nextId: nextId,
        initialStates: initialStates,
        finalStates: finalStates
    }
}

export function addState(
    automaton : Automaton = initAutomaton(),
    position?: Position,
    label?: string,
) {
    const currId = automaton.nextId;

    const newStates = new Map(automaton.states);

    if (!label) {
        label = "q" + currId
        // Possibly add a default label function to allow config preference
    }

    if (!position) {
        position = {x: 100, y: 100}
    }

    newStates.set(
        currId, 
        {
            label: label,
            transitions: new Map<Symbol, Set<StateId>>() // maybe add new Set?
        }
    )

    const newStatePositions = new Map(automaton.statePositions);
    newStatePositions.set(currId, position)

    return {
        ...automaton,
        states: newStates,
        statePositions: newStatePositions,
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

    const newStates = new Map(automaton.states);

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

    const newStatePositions = new Map(automaton.statePositions);
    newStatePositions.delete(rmId);

    return {
        ...automaton,
        states: newStates,
        statePositions: newStatePositions,
        initialStates: newInitialStates,
        finalStates: newFinalStates
    };
}


export function mvState(
    automaton : Automaton, 
    mvId : StateId,
    position : Position
) {
    const newStatePositions = new Map(automaton.statePositions);
    newStatePositions.set(mvId, position)

    return {
        ...automaton,
        statePositions : newStatePositions
    }
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

    const newStates = new Map(automaton.states);

    const newState = {
        ...newStates.get(sourceId)!
    };

    const newTransitions = new Map(newState.transitions);
    
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

export function rmTransition(
    automaton : Automaton,
    sourceId : StateId,
    symbol : Symbol,
    targetId : StateId,
): Automaton {
    if (automaton.alphabet && !automaton.alphabet.has(symbol)){
        return automaton;
    }

    if (!automaton.states.has(sourceId) || !automaton.states.has(targetId)) {
        return automaton;
    }

    const newStates = new Map(automaton.states);
    const newState = {
        ...newStates.get(sourceId)!
    }

    const newTransitions = new Map(newState.transitions);

    if (!newTransitions.has(symbol)) {
        return automaton;
    }

    const newTargets = new Set(newTransitions.get(symbol));

    newTargets.delete(targetId);

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

export function getTransitions(automaton : Automaton): Transition[] {
    const transitions:Transition[] = []
    for (const [sourceId, state] of automaton.states) {
        for (const [symbol, targets] of state.transitions) {
            for (const targetId of targets) {
                transitions.push({
                    source : sourceId,
                    symbol : symbol,
                    target : targetId
                })
            }
        }
    }
    return transitions;
}


export function getPosition(automaton : Automaton, stateId : StateId): Position {
    return automaton.statePositions.get(stateId)!
}
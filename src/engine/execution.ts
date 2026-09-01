import type {
    Automaton,
    RunResult,
    StateId,
    Step,
    Symbol,
    Transition
} from "../types.ts";

function consumeSymbol(
    atmt: Automaton,
    symbol: Symbol,
    currStates: Set<StateId>
): {
    states : Set<StateId>,
    transitions : Transition[]
} {

    let nextStates= new Set<StateId>();
    let transitions: Transition[] = [];

    for (const source of currStates) {
        const state = atmt.states.get(source)!;

        const reachable = state.transitions.get(symbol);

        if (!reachable) {
            continue;
        }
        for (const target of reachable) {
            nextStates.add(target);
            transitions.push({
                source: source,
                target: target,
                symbol: symbol
            });
        }
    }

    return {
        states: nextStates,
        transitions: transitions
    }
}

function epsilonClosure(
    atmt: Automaton,
    currStates: Set<StateId>
): {
    states : Set<StateId>,
    transitions : Transition[]
} {

    let stack = Array.from(currStates);
    let closure = new Set<StateId>(currStates);
    let transitions: Transition[] = [];

    while (stack.length !== 0) {
        const stateId = stack.pop()!;

        const state = atmt.states.get(stateId)!;
        const epsilonTargets = state.transitions.get("");
        if (!epsilonTargets) {
            continue;
        }

        for (const target of epsilonTargets) {
            if (!closure.has(target)) {
                stack.push(target);
                closure.add(target);
                // maybe transitions do not need to be added for epsylon 
                transitions.push({
                    source: stateId,
                    target: target,
                    symbol: ""
                });
            }
        }
    }

    return {
        states: closure,
        transitions: transitions
    };
}


export function runWord(
    atmt: Automaton,
    word: string
): RunResult {

    let currStates = new Set(atmt.initialStates);

    // No initial state defined
    if (currStates.size === 0) {
        return {
            accepted: false,
            error: "No initial state found."
        }
    }

    if (atmt.alphabet && atmt.alphabet.size === 0) {
        return { 
            accepted: false
            // add a message function to give information to the user.
        }
    }

    // Guarantee if word belongs to alphabet
    if (atmt.alphabet) {
        for (const symbol of word) {
            if (!atmt.alphabet.has(symbol)) {
                return {
                    accepted: false,
                    error: `Invalid symbol '${symbol}' in word.`
                }; 
            }
        }
    }

    let closureResult = epsilonClosure(atmt, currStates);
    let steps: Step[] = [{
        type: "epsilon",
        before: Array.from(currStates),
        transitions: closureResult.transitions,
        after: Array.from(closureResult.states)
    }]

    currStates = closureResult.states;

    // Compute each symbol one at a time
    for (const symbol of word) {

        const consumptionResult = consumeSymbol(atmt, symbol, currStates);
        steps.push({
            type: "symbol",
            symbol: symbol,
            before: Array.from(currStates),
            transitions: consumptionResult.transitions,
            after: Array.from(consumptionResult.states)
        });
        currStates = consumptionResult.states;

        if (currStates.size === 0) {
            return {
                accepted: false,
                steps: steps
            };
        }

        closureResult = epsilonClosure(atmt, currStates); 
        steps.push({
            type: "epsilon",
            before: Array.from(currStates),
            transitions: closureResult.transitions,
            after: Array.from(closureResult.states)
        });
        currStates = closureResult.states
    }

    for (const state of currStates) {
        if (atmt.finalStates.has(state)) {
            return {
            accepted: true,
            steps: steps
            }
        }
    }
    
    return {
            accepted: false,
            steps: steps
        };
}


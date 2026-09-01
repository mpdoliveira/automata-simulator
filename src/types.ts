export type Symbol = string;

export type StateId = number;

export type State = {
    label: string;
    transitions : Map<Symbol, Set<StateId>>;
}

export type Transition = {
    source : StateId;
    target : StateId;
    symbol : Symbol;
}

export type Step = {
    type : "symbol" | "epsilon";
    symbol?: Symbol;
    before : StateId[];
    transitions : Transition[];
    after : StateId[];
}

export type Automaton = {
    name : string;
    alphabet?: Set<Symbol>;
    states : Map<StateId, State>;
    nextId : number;
    initialStates : Set<StateId>;
    finalStates : Set<StateId>;
}

export type RunResult = {
    accepted : boolean;
    steps?: Step[];
    error?: string;
}
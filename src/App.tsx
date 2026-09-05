import { 
    initAutomaton,
    addState
 } from "./engine/operations"
import type { Automaton } from "./types"


function Button (
    props : {
        name : string
    }
) {
    return (
        <button>{props.name}</button>
    )
}

function List (
    props : {
        items : String[]
    }
) {
    return (
        <>
            <ul>
                {props.items.map((item) => <li>{item}</li>)}
            </ul>
        </>
    )
}


function stateNames (
    automaton : Automaton
) : String[] {
    const names = [];
    for (const state of automaton.states.values()) {
        names.push(state.label);
    }
    return names;
}


export default function App () {
    let automaton = initAutomaton()

    automaton = addState(automaton, "test")

    return (
        <>
            <Button name="+ State"/>
            <List items={stateNames(automaton)}/>
        </>
    )
}
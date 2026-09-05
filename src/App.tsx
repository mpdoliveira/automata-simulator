import { 
    initAutomaton,
    addState
 } from "./engine/operations"

function Button(
    props : {
        name : string
    }
) {
    return (
        <button>{props.name}</button>
    )
}

export default function App() {
    const automaton = initAutomaton()

    return (
        <>
            <Button name="+ State" />
        </>
    )
}
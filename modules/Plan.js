import Header from './Header'
import Templates from './Templates'
import Days from './Days'
import { useGlobalState } from './GlobalState'

export default function Plan() {
    const { state } = useGlobalState()
    return (
        <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            flexDirection: 'column'
        }}>
            <Header />
            {state.editing && <Templates />}
            <Days />
        </div>
    )
}
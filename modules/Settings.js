import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/dist/client/router'
import { useEffect } from 'react'
import ModalNavigation from './ModalNavigation'
import Button from './Button'
import Select from './Select'
import WeeksList from './WeeksList'
import styles from '../styles/Settings.module.css'
import { useModalState } from './Modal'
import { useGlobalState } from './GlobalState'

export default function Settings() {
    const { data: session } = useSession()
    const router = useRouter()

    const [globalState] = useGlobalState()
    const [state, setState] = useModalState()
    useEffect(() => setState({
        weeks: globalState.weeks,
        selectedWeekId: globalState.selectedWeekId
    }), [])
    const setWeeks = (value) => {
        if (typeof value == 'function') value = value(state.weeks)
        setState((state) => ({ ...state, weeks: value }))
    }
    const setSelectedWeekId = (value) => {
        if (typeof value == 'function') value = value(state.selectedWeekId)
        setState((state) => ({ ...state, selectedWeekId: value }))
    }

    return (
        <div id={styles.container}>
            <ModalNavigation title="Settings" />
            {session && (
                <div id={styles.user}>
                    <img src={session.user.image} />
                    <div id={styles.info}>
                        <p>{session.user.name}</p>
                        <p>{session.user.email}</p>
                    </div>
                    <div id={styles.actions}>
                        <Button style={{backgroundColor: '#6bace8'}}>Export to Google Calendar</Button>
                        <Button style={{backgroundColor: 'var(--color-attention)'}} onClick={() => router.push('/delete', undefined, { shallow: true })}>Delete plan</Button>
                        <Button style={{backgroundColor: 'rgb(180, 180, 180)'}} onClick={() => signOut('google')}><i className="fas fa-sign-in-alt" /></Button>
                    </div>
                </div>
            )}
            <div id={styles.weeks}>
                <h1>Weeks</h1>
                <div id={styles.current}>
                    <p>The current week is:</p>
                    <Select items={state.weeks} selectedId={state.selectedWeekId} setSelectedId={setSelectedWeekId} />
                </div>
                <WeeksList weeks={state.weeks} setWeeks={setWeeks} />
            </div>
        </div>
    )
}
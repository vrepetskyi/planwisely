import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/dist/client/router'
import { useEffect } from 'react'
import ModalNavigation from './ModalNavigation'
import Button from './Button'
import Select from './Select'
import WeeksList from './WeeksList'
import styles from '../styles/Settings.module.css'
import { useModalState } from './Modal'

export default function Settings() {
    const { data: session } = useSession()
    const router = useRouter()

    const [state, setState] = useModalState()
    const setWeeks = (value) => {
        if (typeof value == 'function') value = value(state.weeks)
        setState((state) => ({ ...state, weeks: value }))
    }
    const setOriginWeekId = (value) => {
        if (typeof value == 'function') value = value(state.origin_week_id)
        setState((state) => ({ ...state, origin_week_id: value }))
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
                        <Button style={{backgroundColor: 'rgb(180, 180, 180)'}} onClick={() => signOut()}><i className="fas fa-sign-in-alt" /></Button>
                    </div>
                </div>
            )}
            <div id={styles.weeks}>
                <h1>Weeks</h1>
                <div id={styles.current}>
                    <p>The current week is:</p>
                    <Select items={state.weeks} selectedId={state.origin_week_id} setSelectedId={setOriginWeekId} />
                </div>
                <WeeksList weeks={state.weeks} setWeeks={setWeeks} />
            </div>
        </div>
    )
}
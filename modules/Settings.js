import { useSession, signOut } from 'next-auth/client'
import { useRouter } from 'next/dist/client/router'
import { useState } from 'react'
import ModalNavigation from './ModalNavigation'
import Button from './Button'
import Select from './Select'
import WeeksList from './WeeksList'
import styles from '../styles/Settings.module.css'

export default function Settings() {
    const [session] = useSession()
    const router = useRouter()
    const [selectedWeekId, setSelectedWeekId] = useState(0)
    const [weeks, setWeeks] = useState([{ id: 0, name: 'Week 1' }])
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
                        <Button style={{backgroundColor: '#ea7474'}} onClick={() => router.push('/delete', undefined, { shallow: true })}>Delete plan</Button>
                        <Button style={{backgroundColor: 'rgb(180, 180, 180)'}} onClick={() => signOut('google')}><i className="fas fa-sign-in-alt" /></Button>
                    </div>
                </div>
            )}
            <div id={styles.weeks}>
                <h1>Weeks</h1>
                <div id={styles.current}>
                    <p>The current week is:</p>
                    <Select items={weeks} selectedId={selectedWeekId} setSelectedId={setSelectedWeekId} />
                </div>
                <WeeksList weeks={weeks} setWeeks={setWeeks} />
            </div>
        </div>
    )
}
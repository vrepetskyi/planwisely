import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/dist/client/router'
import Button from './Button'
import Select from './Select'
import WeeksList from './WeeksList'
import styles from '../styles/Settings.module.css'
import { useModalPlan } from './Modal'
import Actions from './Actions'

export default function Settings() {
    const { data: session } = useSession()
    const router = useRouter()

    const [plan, setPlan] = useModalPlan()
    const setWeeks = (value) => {
        if (typeof value == 'function') value = value(plan.weeks)
        setPlan({ ...plan, weeks: value })
    }
    const setOriginWeekId = (value) => {
        if (typeof value == 'function') value = value(plan.origin_week_id)
        setPlan({ ...plan, origin_week_id: value })
    }

    return (
        <div id={styles.container}>
            {session && (
                <div id={styles.account}>
                    <div id={styles.user}>
                        <img src={session.user.image} />
                        <div id={styles.info}>
                            <p>{session.user.name}</p>
                            <p>{session.user.email}</p>
                        </div>
                    </div>
                    <div id={styles.actions}>
                        <Button style={{ backgroundColor: "#6bace8" }}>Export to Google Calendar</Button>
                        <Button style={{ backgroundColor: "var(--color-attention)"}} onClick={() => router.push('/delete', undefined, { shallow: true })}>Delete plan</Button>
                        <Button style={{ backgroundColor: "rgb(180, 180, 180)"}} onClick={() => signOut()}><i className="fas fa-sign-in-alt" /></Button>
                    </div>
                </div>
            )}
            <div id={styles.weeks}>
                <div id={styles.current}>
                    <p>The current week is:</p>
                    <Select items={plan.weeks} selectedId={plan.origin_week_id} setSelectedId={setOriginWeekId} />
                </div>
                <WeeksList weeks={plan.weeks} setWeeks={setWeeks} />
            </div>
            <Actions>
                <Button hoverColor="rgba(0, 0, 0, .8)" onClick={() => router.push('/', undefined, { shallow: true })}>Ok</Button>
            </Actions>
        </div>
    )
}
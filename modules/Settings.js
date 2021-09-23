import { signIn, signOut } from 'next-auth/client'
import Button from './Button'
import styles from '../styles/Settings.module.css'

export default function Settings({ session, setModal }) {
    let user
    let planActions
    if(session) {
        user = (
            <div id={styles.user}>
                <img />
                <p>{session.user.name}</p>
                <p>{session.user.email}</p>
                <Button className={styles.signOut} onClick={() => signOut('google')}><i className="fas fa-sign-in-alt" /></Button>
            </div>
        )
        planActions = (
            <div id={styles.planActions}>
                <Button onClick={() => setModal(user)}>Export to Google Calendar</Button>
                <Button>Delete plan</Button>
            </div>
        )
    } else {
        planActions = (
            <div id={styles.planActions}>
                <Button>Export to Google Calendar</Button>
                <Button onClick={() => signIn('google')}>Save plan</Button>
            </div>
        )
    }

    return (
        <div id={styles.settings}>
            {user}
            {planActions}
        </div>
    )
}
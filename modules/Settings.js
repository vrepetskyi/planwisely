import { useSession, signOut } from 'next-auth/client'
import { useModal } from './Modal'
import ModalNavigation from './ModalNavigation'
import Button from './Button'
import styles from '../styles/Settings.module.css'

export default function Settings() {
    const [session] = useSession()
    const showModal = useModal()
    return (
        <div id={styles.container}>
            <ModalNavigation title="Settings" showModal={showModal} />
            {session && (
                <div id={styles.user}>
                    <img src={session.user.image} />
                    <div id={styles.info}>
                        <p>{session.user.name}</p>
                        <p>{session.user.email}</p>
                    </div>
                    <div id={styles.actions}>
                        <Button className={styles.export}>Export to Google Calendar</Button>
                        <Button className={styles.delete}>Delete plan</Button>
                        <Button className={styles.logout} onClick={() => signOut('google')}><i className="fas fa-sign-in-alt" /></Button>
                    </div>
                </div>
            )}
        </div>
    )
}
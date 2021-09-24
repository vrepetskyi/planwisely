import { useSession, signIn, signOut } from 'next-auth/client'
import { useModal } from './Modal'
import Button from './Button'
import Settings from './Settings'
import styles from '../styles/Header.module.css'

export default function Header({ isVisible, content, showModal }) {
    const [session] = useSession()
    
    let settings = <Settings session={session} showModal={showModal} />

    return (
        <header id={styles.header}>
            <div id={styles.logo}>
                <img src="/planwisely.svg" />
                <h1>planwisely</h1>
            </div>
            {!session && <p id={styles.loginAlert}>Change anything. <Button className={styles.signInButton} onClick={() => signIn('google')}>Sign in</Button> to save</p>}
            <div>
                <Button className={styles.headerButton}><i aria-hidden className={styles.headerIcon + " fas fa-pen"} /></Button>
                <Button className={styles.headerButton} onClick={() => showModal(settings)}><i aria-hidden className={styles.headerIcon + " fas fa-cog"} /></Button>
                <Button className={styles.headerButton} onClick={() => session ? signOut('google') : signIn('google')}><i aria-hidden className={styles.headerIcon + session ? " fas fa-sign-in-alt" : " fab fa-google"} /></Button>
            </div>
        </header>
    )
}
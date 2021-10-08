import { useSession, signIn, signOut } from 'next-auth/react'
import { useRouter } from 'next/dist/client/router'
import Button from './Button'
import styles from '../styles/Header.module.css'
import { useGlobalState } from './GlobalState'

export default function Header() {
    const { data: session } = useSession()
    const router = useRouter()
    const [globalState] = useGlobalState()

    return (
        <header id={styles.header}>
            <div id={styles.logo}>
                <img src="/planwisely.svg" />
                <h1>planwisely</h1>
            </div>
            {
                globalState.message ? <p id={styles.alert} style={{color: 'var(--color-attention)'}}>{globalState.message}</p> :
                !session && <p id={styles.alert}>Change anything. <Button onClick={() => signIn('google')}>Sign in</Button> to save</p>
            }
            <div id={styles.actions}>
                <Button><i aria-hidden className=" fas fa-pen" /></Button>
                <Button onClick={() => router.push('/settings', undefined, { shallow: true })}><i aria-hidden className="fas fa-cog" /></Button>
                <Button onClick={() => session ? signOut('google') : signIn('google')}><i aria-hidden className={session ? " fas fa-sign-in-alt" : " fab fa-google"} /></Button>
            </div>
        </header>
    )
}
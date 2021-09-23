import { useSession, signIn, signOut } from 'next-auth/client'
import Head from 'next/head'
import Button from '../modules/Button'
import { useContext } from 'react'
import { ModalContext } from '../modules/Modal'
import Settings from '../modules/Settings'
import styles from '../styles/Home.module.css'

export default function Home() {
  const [session] = useSession()
  const setModal = useContext(ModalContext)

  let loginAlert
  let loginButton
  if (session) {
    loginButton = <Button className={styles.headerButton} onClick={() => signOut('google')}><i className={styles.headerIcon + " fas fa-sign-in-alt"} /></Button>
  }
  else {
    loginAlert = <p id={styles.loginAlert}>Change anything. <Button className={styles.signInButton} onClick={() => signIn('google')}>Sign in</Button> to save</p>
    loginButton = <Button className={styles.headerButton} onClick={() => signIn('google')}><i className={styles.headerIcon + " fab fa-google"} /></Button>
  }
  let settings = <Settings session={session} setModal={setModal} />

  return (
    <>
    <Head>
      <title>planwisely</title>
    </Head>
    <header id={styles.header}>
      <h1>planwisely</h1>
      {loginAlert}
      <div>
        <Button className={styles.headerButton} onClick={() => setModal()}><i className={styles.headerIcon + " fas fa-pen"} /></Button>
        <Button className={styles.headerButton} onClick={() => setModal(settings)}><i className={styles.headerIcon + " fas fa-cog"} /></Button>
        {loginButton}
      </div>
    </header>
    </> 
  )
}

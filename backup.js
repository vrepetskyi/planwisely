import Script from 'next/script'
import { useState } from 'react'
import { Provider } from 'next-auth/client'
import Modal, { ModalContext } from '../modules/Modal'
import '../styles/globals.css'

const useModal = (initialValue) => {
  const [content, setModal] = useState(initialValue)

  const modalHistory = []
  const setModalWithHistory = (modal) => {
    modalHistory.push(modal)
    history.pushState({modalId: modalHistory.indexOf(modal)}, '')
    setModal(modal)
  }

  return [content, setModalWithHistory]
}

export default function MyApp({ Component, pageProps }) {
  const [content, setModal] = useModal()
  return (
    <>
    <Script src="https://kit.fontawesome.com/d7252dcce3.js" crossOrigin="anonymous" />
    <ModalContext.Provider value={setModal}>
      <Provider session={pageProps.session}>
        <Component {...pageProps} />
      </Provider>
    </ModalContext.Provider>
    <Modal content={content} setModal={setModal} />
    </>
  )
}



import React, {createContext, useEffect, useRef} from 'react'
import styles from '../styles/Modal.module.css'

export const ModalContext = createContext()
let actualContent, targetContent
const transitionDuration = 200
const style = {transitionDuration: transitionDuration + 'ms'}
let transitionTimeout


export default function Modal({ content, setModal }) {
    const handleHistory = (e) => {
        console.log(e.state)
    }
    useEffect(() => {
        window.addEventListener('popstate', handleHistory)
        return () => window.removeEventListener('popstate', handleHistory)
    }, [])

    const containerRef = useRef()
    const handleBackdrop = (e) => {if (!containerRef?.current?.contains(e.target)) setModal()}
    let backdropVisible, containerVisible
    
    if (transitionTimeout && content != targetContent) {
        actualContent = targetContent
        clearTimeout(transitionTimeout)
        transitionTimeout = null
    }

    targetContent = content

    if (actualContent == content) {
        if (content) {
            backdropVisible = true
            containerVisible = true
        } else {
            backdropVisible = false
            containerVisible = true
        }
    } else {
        if (!actualContent && content) {
            backdropVisible = true
            containerVisible = true
            actualContent = content
        }
        if (actualContent && !content) {
            backdropVisible = false
            containerVisible = true
            transitionTimeout = setTimeout(() => {
                actualContent = targetContent
                transitionTimeout = null
            }, transitionDuration)
        }
        if (actualContent && content) {
            console.log(1)
            backdropVisible = true
            containerVisible = false
            transitionTimeout = setTimeout(() => {
                actualContent = targetContent
                transitionTimeout = null
            }, transitionDuration)
        }
    }
    
    return (
        <div id={styles.backdrop} className={backdropVisible ? styles.visible : null} style={style} onClick={handleBackdrop}>
            <div id={styles.container} className={containerVisible ? styles.visible : null} style={style} ref={containerRef}>
                {actualContent}
            </div>
        </div>
    )
}


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
    loginButton = <Button className={styles.headerButton} onClick={() => signOut('google')}><i aria-hidden className={styles.headerIcon + " fas fa-sign-in-alt"} /></Button>
  }
  else {
    loginAlert = <p id={styles.loginAlert}>Change anything. <Button className={styles.signInButton} onClick={() => signIn('google')}>Sign in</Button> to save</p>
    loginButton = <Button className={styles.headerButton} onClick={() => signIn('google')}><i aria-hidden className={styles.headerIcon + " fab fa-google"} /></Button>
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
        <Button className={styles.headerButton}><i aria-hidden className={styles.headerIcon + " fas fa-pen"} /></Button>
        <Button className={styles.headerButton} onClick={() => setModal(settings)}><i aria-hidden className={styles.headerIcon + " fas fa-cog"} /></Button>
        {loginButton}
      </div>
    </header>
    </> 
  )
}

import { useRouter } from 'next/dist/client/router'
import React, { createContext, useContext, useEffect, useRef, useState } from 'react'
import { useGlobalState } from './GlobalState'
import styles from '../styles/Modal.module.css'
import { useSession } from 'next-auth/react'

let replaceTimeout, errorTimeout, previousContent, isVisible

const ModalStateContext = createContext()

export const useModalState = () => useContext(ModalStateContext)

let lastContent
export default function Modal({ content: targetContent, canClose }) {
    const router = useRouter()
    const [content, setContent] = useState()
    const [globalState, setGlobalState] = useGlobalState()
    const [contentState, setContentState] = useState(globalState)
    const { status } = useSession()

    // save state before unload
    const handleBeforeUnload = () => {
        setGlobalState(contentState)
        window.removeEventListener('beforeunload', () => handleBeforeUnload)
    }
    useEffect(() => {
        window.addEventListener('beforeunload', () => handleBeforeUnload)
        return () => window.removeEventListener('beforeunload', () => handleBeforeUnload)
    }, [contentState])

    // reinit contentState on globalState change
    useEffect(() => contentState != globalState && setContentState(globalState), [globalState])

    useEffect(() => {
        // update globalState on modal closure
        if (content && targetContent != content && globalState != contentState && canClose) setGlobalState(contentState)

        // update modal content
        targetContent ? isVisible = true : isVisible = false
        setContent((content) => {
            if (replaceTimeout) {
                clearTimeout(replaceTimeout)
                replaceTimeout = null
            }
            if (targetContent && content) {
                replaceTimeout = setTimeout(() => {
                    setContent(targetContent)
                    replaceTimeout = null
                }, 300)
                return null
            } else return targetContent
        })
    }, [targetContent])

    const backdropRef = useRef()
    const handleBackdrop = (e) => { if (!backdropRef.current.children[0].contains(e.target) ) {
        if (canClose) router.push('/', undefined, { shallow: true })
        else {
            clearTimeout(errorTimeout)
            backdropRef.current.style.backgroundColor = 'rgba(100, 0, 0, .125)'
            errorTimeout = setTimeout(() => {
                backdropRef.current.style.backgroundColor = 'rgba(0, 0, 0, .1)'
            }, 300)
        }
     }}

    const visibleContent = content || previousContent
    previousContent = visibleContent
    
    return (
        <ModalStateContext.Provider value={[contentState, setContentState]}>
            <div id={styles.backdrop} className={isVisible ? styles.visible : null} onClick={handleBackdrop} ref={backdropRef}>
                <div id={styles.container} className={content ? styles.visible : null}>
                    {visibleContent}
                </div>
            </div>
        </ModalStateContext.Provider>
    )
}
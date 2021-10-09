import { useRouter } from 'next/dist/client/router'
import React, { createContext, useContext, useEffect, useRef, useState } from 'react'
import { useGlobalState } from './GlobalState'
import styles from '../styles/Modal.module.css'

const transitionDuration = 300
const style = { transitionDuration: transitionDuration + 'ms' }
let replaceTimeout, previousContent, isVisible

const ModalStateContext = createContext()

export const useModalState = () => useContext(ModalStateContext)

export default function Modal({ children: targetContent }) {
    const [content, setContent] = useState()
    const [globalState, setGlobalState] = useGlobalState()
    const [contentState, setContentState] = useState(globalState)

    useEffect(() => {
        // update global state on modal closure
        if (previousContent && (content && !targetContent || content == previousContent) && !(previousContent?.type == content?.type && content?.type == targetContent?.type)) {
            setGlobalState(contentState)
        }

        // update modal content
        targetContent ? isVisible = true : isVisible = false
        setContent((content) => {
            if (replaceTimeout) {
                clearTimeout(replaceTimeout)
                replaceTimeout = null
            }
            if (targetContent && content && targetContent.type != content.type) {
                replaceTimeout = setTimeout(() => {
                    setContent(targetContent)
                    replaceTimeout = null
                }, transitionDuration)
                return null
            } else return targetContent
        })
    }, [targetContent])

    const modalRef = useRef()
    const router = useRouter()
    const handleBackdrop = (e) => { if (!modalRef?.current?.contains(e.target)) router.push('/', undefined, { shallow: true }) }

    const visibleContent = content || previousContent
    previousContent = visibleContent
    
    return (
        <ModalStateContext.Provider value={[contentState, setContentState]}>
            <div id={styles.backdrop} className={isVisible ? styles.visible : null} style={style} onClick={handleBackdrop}>
                <div id={styles.container} className={content ? styles.visible : null} style={style} ref={modalRef}>
                    {visibleContent}
                </div>
            </div>
        </ModalStateContext.Provider>
    )
}
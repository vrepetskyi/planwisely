import React, { useContext, useEffect, useRef, useState } from 'react'
import styles from '../styles/ModalContainer.module.css'

const transitionDuration = 300

let replaceTimeout, isVisible
export let modalHistory = []
const useContent = () => {
    const [content, setContent] = useState()

    const pushHistory = (content) => {
        modalHistory.push(content)
        history.pushState({modalHistoryId: modalHistory.length - 1}, '')
    }
    
    const showModal = (targetContent, isPopState) => {
        targetContent ? isVisible = true : isVisible = false
        setContent((content) => {
            if (replaceTimeout) {
                clearTimeout(replaceTimeout)
                replaceTimeout = null
            }
            if (targetContent && content && targetContent != content) {
                replaceTimeout = setTimeout(() => {
                    setContent(targetContent)
                    replaceTimeout = null
                }, transitionDuration)
                return null
            } else return targetContent
        })
        !isPopState && pushHistory(targetContent)
    }
    const handlePopState = (e) => {
        if ('modalHistoryId' in e.state)
            showModal(modalHistory[e.state.modalHistoryId], true)
    }
    useEffect(() => {
        pushHistory()
        window.addEventListener('popstate', handlePopState)
        return () => window.removeEventListener('popstate', handlePopState)
    }, [])
    
    return [isVisible, content, showModal]
}

const ModalContext = React.createContext()
export const useModal = () => useContext(ModalContext)

const style = {transitionDuration: transitionDuration + 'ms'}

let previousContent
const ModalContainer = ({ isVisible, content, showModal }) => {
    const modalRef = useRef()
    const handleBackdrop = (e) => {if (!modalRef?.current?.contains(e.target)) showModal()}

    const visibleContent = content || previousContent
    previousContent = visibleContent

    return (
        <div id={styles.backdrop} className={isVisible ? styles.visible : null} style={style} onClick={handleBackdrop}>
            <div id={styles.container} className={content ? styles.visible : null} style={style} ref={modalRef}>
                {visibleContent}
            </div>
        </div>
    )
}

export const ModalProvider = ({ children }) => {
    const [isVisible, content, showModal] = useContent()
    return (
        <ModalContext.Provider value={showModal}>
            {children}
            <ModalContainer isVisible={isVisible} content={content} showModal={showModal} />
        </ModalContext.Provider>
    )
}
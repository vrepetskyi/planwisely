import React, {createContext, useEffect, useRef} from 'react'
import styles from '../styles/Modal.module.css'

export const ModalContext = createContext()
let actualContent, targetContent
const transitionDuration = 1000
const style = {transitionDuration: transitionDuration + 'ms'}
let transitionTimeout


export default function Modal({ content, setModal }) {
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
    } else
    if (!actualContent && content) {
        backdropVisible = true
        containerVisible = true
        actualContent = content
    } else
    if (actualContent && !content) {
        backdropVisible = false
        containerVisible = true
        transitionTimeout = setTimeout(() => {
            actualContent = targetContent
            transitionTimeout = null
        }, transitionDuration)
    }

    return (
        <div id={styles.backdrop} className={backdropVisible ? styles.visible : null} style={style} onClick={handleBackdrop}>
            <div id={styles.container} className={containerVisible ? styles.visible : null} style={style} ref={containerRef}>
                {actualContent}
            </div>
        </div>
    )
}
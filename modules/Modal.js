import { useRouter } from 'next/dist/client/router'
import React, { useEffect, useRef, useState } from 'react'
import styles from '../styles/Modal.module.css'

const transitionDuration = 300
const style = { transitionDuration: transitionDuration + 'ms' }
let replaceTimeout, previousContent, isVisible

export default function Modal({ children: targetContent }) {
    const [content, setContent] = useState()

    useEffect(() => {
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
        <div id={styles.backdrop} className={isVisible ? styles.visible : null} style={style} onClick={handleBackdrop}>
            <div id={styles.container} className={content ? styles.visible : null} style={style} ref={modalRef}>
                {visibleContent}
            </div>
        </div>
    )
}
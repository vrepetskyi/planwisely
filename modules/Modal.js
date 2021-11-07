import { useRouter } from 'next/dist/client/router'
import React, { createContext, useContext, useEffect, useRef, useState } from 'react'
import { useGlobalState } from './GlobalState'
import styles from '../styles/Modal.module.css'

let replaceTimeout, errorTimeout, previousContent, isVisible

const ModalPlanContext = createContext()

export const useModalPlan = () => useContext(ModalPlanContext)

export default function Modal({ content: targetContent, canClose }) {
    const router = useRouter()
    const [content, setContent] = useState()
    const { plan, setPlan } = useGlobalState()
    const [contentPlan, setContentPlan] = useState(plan)

    // save state before unload
    const handleBeforeUnload = () => {
        setPlan(contentPlan)
        window.removeEventListener('beforeunload', () => handleBeforeUnload)
    }
    useEffect(() => {
        window.addEventListener('beforeunload', () => handleBeforeUnload)
        return () => window.removeEventListener('beforeunload', () => handleBeforeUnload)
    }, [contentPlan])

    const handleKeydown = (e) => {
        if (canClose && (e.key == 'Enter' || e.key == 'Escape')) {
            document.activeElement.blur()
            router.push('/', undefined, { shallow: true })
        }
    }

    useEffect(() => {
        window.addEventListener('keydown', handleKeydown)
        return () => window.removeEventListener('keydown', handleKeydown)
    }, [canClose])

    // reinit local plan on global plan change
    useEffect(() => setContentPlan(plan), [plan])

    useEffect(() => {
        // update global plan on modal closure
        if (content && targetContent != content && canClose) setPlan(contentPlan)

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
        <ModalPlanContext.Provider value={[contentPlan, setContentPlan]}>
            <div id={styles.backdrop} className={isVisible ? styles.visible : null} onClick={handleBackdrop} ref={backdropRef}>
                <div id={styles.container} className={content ? styles.visible : null}>
                    {visibleContent}
                </div>
            </div>
        </ModalPlanContext.Provider>
    )
}
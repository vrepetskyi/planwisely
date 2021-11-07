import { useEffect, useRef } from 'react'
import styles from '../styles/Button.module.css'

export default function Button({ className, children, hoverColor, style, ...props }) {
    const buttonRef = useRef()
    useEffect(() => {
        const childrenBorderRadius = window.getComputedStyle(buttonRef.current).borderRadius
        if (childrenBorderRadius != '0px') buttonRef.current.style.setProperty('--border-radius', childrenBorderRadius)
        else buttonRef.current.style.setProperty('--border-radius', Math.min(buttonRef.current.offsetWidth, buttonRef.current.offsetHeight) / 2 + 'px')
        if (window.getComputedStyle(buttonRef.current).backgroundColor == 'rgba(0, 0, 0, 0)') {
            buttonRef.current.style.setProperty('--color-hover', 'rgba(0, 0, 0, .1')
        } else {
            buttonRef.current.style.setProperty('--mix-blend-mode', 'overlay')
        }
    }, [])
    return (
        <button
            style={{ '--color-hover': hoverColor, ...style }}
            className={[styles.button, children.type == 'i' && styles.containingIcon, className].filter((element) => element).join(' ')}
            tabIndex='-1'
            ref={buttonRef}
            {...props}
        >
            {children}
        </button>
    )
}
import { useEffect, useRef } from 'react'
import styles from '../styles/Button.module.css'

export default function Button({ className, children, ...props }) {
    const buttonRef = useRef()
    useEffect(() => {
        buttonRef.current.style.setProperty('--border-radius', Math.min(buttonRef.current.offsetWidth, buttonRef.current.offsetHeight) / 2 + 'px')
    })
    return (
        <button className={`${styles.button} ${children.type == 'i' && styles.containingIcon} ${className}`} {...props} ref={buttonRef}>
            {children}
        </button>
    )
}
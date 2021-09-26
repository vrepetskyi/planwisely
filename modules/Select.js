import { useEffect, useRef, useState } from "react"
import Button from "./Button"
import styles from '../styles/Select.module.css'

let lastScrollPosition
export default function Select({ items }) {
    const [selectedId, setSelectedId] = useState(0)
    const [visible, setVisible] = useState()

    const selectRef = useRef()
    
    const handleClick = (e) => {
        if (selectRef.current.contains(e.target)) {
            if (e.target.value) {
                if (visible && e.target.value) {
                    setSelectedId(e.target.value)
                    setVisible()
                } else e.target.value == selectedId && setVisible(true)
            }
        } else visible && setVisible()
    }

    const handleScroll = (e) => {
        if (e.deltaY > 0) setSelectedId((selectedId) => Math.min(items.length - 1, selectedId + 1))
        if (e.deltaY < 0) setSelectedId((selectedId) => Math.max(0, selectedId - 1))
    }

    useEffect(() => {
        const listElem = selectRef.current.children[0]
        const itemElem = listElem.children[0]
        selectRef.current.style.width = itemElem.offsetWidth + 'px'
        selectRef.current.style.height = itemElem.offsetHeight + 'px'
        listElem.style.transform = `translateY(-${itemElem.offsetHeight * selectedId}px)`
        listElem.style.borderRadius = window.getComputedStyle(itemElem).getPropertyValue('border-radius')
        if (visible) window.addEventListener('wheel', handleScroll, {passive: true})
        else listElem.addEventListener('wheel', handleScroll, {passive: true})
        window.addEventListener('click', handleClick)
        return () => {
            if (visible) window.removeEventListener('wheel', handleScroll)
            else listElem.removeEventListener('wheel', handleScroll)
            window.removeEventListener('click', handleClick)
        }
    })

    return (
        <div id={styles.select} ref={selectRef}>
            <div id={styles.list} className={visible ? styles.visible : null}>
                {items.map((item, i) => {
                    return <Button key={i} value={i} className={(visible || i == selectedId) ? styles.visible : null} style={{textDecoration: i == selectedId ? 'underline' : null}}>{item}</Button>
                })}
            </div>
        </div>
    )
}
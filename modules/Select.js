import { useEffect, useRef, useState } from "react"
import Button from "./Button"
import styles from '../styles/Select.module.css'

export default function Select({ items, selectedId, setSelectedId }) {
    const [visible, setVisible] = useState()
    const selectRef = useRef()

    const selectedIndex = items.findIndex(item => item.id == selectedId)
    
    const handleClick = (e) => {
        if (selectRef.current.contains(e.target)) {
            const targetIndex = e.target.value
            if (targetIndex) {
                if (visible && targetIndex) {
                    setSelectedId(items[targetIndex].id)
                    setVisible()
                } else items.length > 1 && targetIndex == selectedIndex && setVisible(true)
            }
        } else visible && setVisible()
    }

    const handleScroll = (e) => {
        if (e.deltaY > 0) setSelectedId(items[Math.min(items.length - 1, selectedIndex + 1)].id)
        if (e.deltaY < 0) setSelectedId(items[Math.max(0, selectedIndex - 1)].id)
    }

    useEffect(() => {
        //handle empty item
        if (!items[selectedIndex]) setSelectedId(items[items.length - 1].id)
        //set select style depending on content
        const listElem = selectRef.current.children[0]
        const itemElem = listElem.children[0]

        selectRef.current.style.width = itemElem.offsetWidth + 'px'
        selectRef.current.style.height = itemElem.offsetHeight + 'px'
        listElem.style.transform = `translateY(-${itemElem.offsetHeight * selectedIndex}px)`
        listElem.style.borderRadius = window.getComputedStyle(itemElem).getPropertyValue('border-radius')
        
        //handle events
        if (visible) window.addEventListener('wheel', handleScroll, {passive: true})
        else listElem.addEventListener('wheel', handleScroll, {passive: true})
        window.addEventListener('click', handleClick)
        return () => {
            if (visible) window.removeEventListener('wheel', handleScroll)
            else listElem.removeEventListener('wheel', handleScroll)
            window.removeEventListener('click', handleClick)
        }
    })

    //force update select dimensions on init
    useEffect(() => setVisible(false), [])

    return (
        <div id={styles.select} ref={selectRef}>
            <div id={styles.list} className={visible ? styles.visible : null}>
                {items.map((item, i) => {
                    return <Button key={i} value={i} className={(visible || i == selectedIndex) ? styles.visible : null} style={{textDecoration: i == selectedIndex ? 'underline' : null}}>{item.name}</Button>
                })}
            </div>
        </div>
    )
}
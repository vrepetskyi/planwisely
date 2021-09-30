import { useEffect, useRef, useState } from "react"
import Button from "./Button"
import styles from '../styles/Select.module.css'

export default function Select({ items, index, setIndex }) {
    const [visible, setVisible] = useState()

    const selectRef = useRef()
    
    const handleClick = (e) => {
        if (selectRef.current.contains(e.target)) {
            if (e.target.value) {
                if (visible && e.target.value) {
                    setIndex(e.target.value)
                    setVisible()
                } else items.length > 1 && e.target.value == index && setVisible(true)
            }
        } else visible && setVisible()
    }

    const handleScroll = (e) => {
        if (e.deltaY > 0) setIndex((index) => Math.min(items.length - 1, index + 1))
        if (e.deltaY < 0) setIndex((index) => Math.max(0, index - 1))
    }

    useEffect(() => {
        //set select style depending on content
        const listElem = selectRef.current.children[0]
        const itemElem = listElem.children[0]

        selectRef.current.style.width = itemElem.offsetWidth + 'px'
        selectRef.current.style.height = itemElem.offsetHeight + 'px'
        listElem.style.transform = `translateY(-${itemElem.offsetHeight * index}px)`
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
                    return <Button key={i} value={i} className={(visible || i == index) ? styles.visible : null} style={{textDecoration: i == index ? 'underline' : null}}>{item}</Button>
                })}
            </div>
        </div>
    )
}
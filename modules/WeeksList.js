import Button from "./Button"
import Text from "./Text"
import styles from '../styles/WeeksList.module.css'
import { useRef } from "react"

let weeksChildren, dragIndex, dragHeight, initialMouseY, initialPositionY, minOffsetY, maxOffsetY, targetIndex, transitionTimeout
export default function WeeksList({ weeks, setWeeks }) {
    const weeksRef = useRef()

    const registerDrag = (e) => {
        const offsetY = Math.min(maxOffsetY, Math.max(e.clientY - initialMouseY, minOffsetY))
        const positionY = initialPositionY + offsetY

        targetIndex = 0
        while (positionY > weeksChildren[targetIndex].offsetTop + weeksChildren[targetIndex].offsetHeight / 2) targetIndex++

        for (let i = 0; i < weeksChildren.length; i++) {
            if (i == dragIndex) {
                weeksChildren[i].style.transform = `translateY(${offsetY}px)`
                weeksChildren[i].style.transition = 'box-shadow .3s, opacity .3s'
            }
            else {
                if (i <= targetIndex && i > dragIndex) {
                    weeksChildren[i].style.transform = `translateY(${-dragHeight}px)`
                } else if (i >= targetIndex && i < dragIndex) {
                    weeksChildren[i].style.transform = `translateY(${dragHeight}px)`
                } else {
                    weeksChildren[i].style.transform = 'none'
                }
                weeksChildren[i].style.transition = 'transform .3s'
            }
        }
    }

    const startDrag = (e, index) => {
        if (transitionTimeout) return

        weeksChildren = weeksRef.current.children
        dragIndex = index
        dragHeight = weeksChildren[dragIndex].offsetHeight + parseInt(window.getComputedStyle(weeksChildren[dragIndex]).marginTop)
        initialMouseY = e.clientY
        initialPositionY = weeksChildren[dragIndex].offsetTop
        minOffsetY = weeksChildren[0].offsetTop - initialPositionY
        maxOffsetY = weeksChildren[weeksChildren.length - 1].offsetTop - initialPositionY

        weeksChildren[dragIndex].style.transition = 'box-shadow .3s, opacity .3s'
        weeksChildren[dragIndex].style.boxShadow = '0 0 4px gray'
        weeksChildren[dragIndex].style.zIndex = 1

        window.addEventListener('mousemove', registerDrag)
        window.addEventListener('mouseup', endDrag)

        registerDrag(window.event)
    }

    const endDrag = () => {
        window.removeEventListener('mouseup', endDrag)
        window.removeEventListener('mousemove', registerDrag)

        weeksChildren[dragIndex].style.transition = 'box-shadow .3s, opacity .3s, z-index 0s .3s, transform .3s'
        weeksChildren[dragIndex].style.transform = `translateY(${weeksChildren[targetIndex].offsetTop - initialPositionY}px)`
        weeksChildren[dragIndex].style.boxShadow = '0 0 4px transparent'
        weeksChildren[dragIndex].style.zIndex = 0
        
        if (targetIndex != dragIndex) {
            transitionTimeout = setTimeout(() => {
                setWeeks((oldWeeks) => {
                    const weeks = [...oldWeeks]
                    if (targetIndex < dragIndex) {
                        weeks.splice(dragIndex, 1)
                        weeks.splice(targetIndex, 0, oldWeeks[dragIndex])
                    } else {
                        weeks.splice(targetIndex + 1, 0, oldWeeks[dragIndex])
                        weeks.splice(dragIndex, 1)
                    }
                    return weeks
                })
                for (let i = 0; i < weeksChildren.length; i++) {
                    weeksChildren[i].style.transition = 'none'
                    weeksChildren[i].style.transform = 'none'
                }
                transitionTimeout = undefined
            }, 300)
        }
    }
    
    const changeWeek = (id, value) => {
        setWeeks((oldWeeks) => {
            const weeks = [...oldWeeks]
            if (id == undefined) {
                let id = 0
                while (weeks.find(week => week.id == id)) id++
                weeks.push({ id, name: `Week ${weeks.length + 1}` })
            } else {
                const weekIndex = weeks.findIndex(week => week.id == id)
                if (value) weeks[weekIndex].name = value
                else if (weeks.length > 1) weeks.splice(weekIndex, 1)
            }
            return weeks
        })
    }

    return (
        <div id={styles.container}>
            <div id={styles.weeks} ref={weeksRef}>
                {weeks.map((week, index) => {
                    return (
                        <div key={week.id} className={styles.week}>
                            {weeks.length > 1 && <Button onMouseDown={(e) => startDrag(e, index)}><i className="fas fa-bars" /></Button>}
                            <Text maxlength="32" value={week.name} setValue={(value) => changeWeek(week.id, value)} />
                            {weeks.length > 1 && <Button onClick={() => changeWeek(week.id)}><i className="fas fa-times" /></Button>}
                        </div>
                    )
                })}
            </div>
            {weeks.length < 4 && <Button style={{marginTop: '10px'}} onClick={() => changeWeek()}><i className="fas fa-plus" /></Button>}
        </div>
    )
}
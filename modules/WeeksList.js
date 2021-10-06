import Button from "./Button"
import Text from "./Text"
import styles from '../styles/WeeksList.module.css'
import { useRef } from "react"

let weeks, dragIndex, dragHeight, initialMouseY, initialPositionY, minOffsetY, maxOffsetY, targetIndex
export default function WeeksList({ weeks, setWeeks }) {
    const weeksRef = useRef()

    const registerDrag = (e) => {
        const offsetY = Math.min(maxOffsetY, Math.max(e.clientY - initialMouseY, minOffsetY))
        const positionY = initialPositionY + offsetY

        targetIndex = 0
        while (positionY > weeks[targetIndex].offsetTop + weeks[targetIndex].offsetHeight / 2) targetIndex++

        for (let i = 0; i < weeks.length; i++) {
            if (i == dragIndex) {
                weeks[i].style.transform = `translateY(${offsetY}px)`
                weeks[i].style.transition = 'none'
            }
            else {
                if (i <= targetIndex && i > dragIndex) {
                    weeks[i].style.transform = `translateY(${-dragHeight}px)`
                } else if (i >= targetIndex && i < dragIndex) {
                    weeks[i].style.transform = `translateY(${dragHeight}px)`
                } else {
                    weeks[i].style.transform = 'none'
                }
                weeks[i].style.transition = 'transform .3s'
            }
        }
    }

    const startDrag = (e, index) => {
        weeks = weeksRef.current.children
        dragIndex = index
        dragHeight = weeks[dragIndex].offsetHeight + parseInt(window.getComputedStyle(weeks[dragIndex]).marginTop)
        initialMouseY = e.clientY
        initialPositionY = weeks[dragIndex].offsetTop
        minOffsetY = weeks[0].offsetTop - initialPositionY
        maxOffsetY = weeks[weeks.length - 1].offsetTop - initialPositionY

        weeks[dragIndex].style.transition = 'box-shadow .3s, opacity .3s'
        weeks[dragIndex].style.boxShadow = '0 0 4px gray'
        weeks[dragIndex].style.zIndex = 1

        window.addEventListener('mousemove', registerDrag)
        window.addEventListener('mouseup', endDrag)
    }

    const endDrag = () => {
        window.removeEventListener('mouseup', endDrag)
        window.removeEventListener('mousemove', registerDrag)

        weeks[dragIndex].style.transition = 'box-shadow .3s, opacity .3s, z-index 0s .3s, transform .3s'
        weeks[dragIndex].style.transform = `translateY(${weeks[targetIndex].offsetTop - initialPositionY}px)`
        weeks[dragIndex].style.boxShadow = '0 0 4px transparent'
        weeks[dragIndex].style.zIndex = 0
        
        if (dragIndex != undefined && targetIndex != dragIndex) {
            setTimeout(() => {
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
                for (let i = 0; i < weeks.length; i++) {
                    weeks[i].style.transition = 'none'
                    weeks[i].style.transform = 'none'
                }
                dragIndex = undefined
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
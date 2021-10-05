import Button from "./Button"
import Text from "./Text"
import styles from '../styles/WeeksList.module.css'
import { useRef } from "react"

let dragTarget, initialY, minOffsetY, maxOffsetY
export default function WeeksList({ weeks, setWeeks }) {
    const weeksRef = useRef()

    const registerDrag = (e) => {
        weeksRef.current.children[dragTarget].style.transform = `translateY(${Math.min(maxOffsetY, Math.max(e.clientY - initialY, minOffsetY))}px)`
    }
    const startDrag = (e, index) => {
        dragTarget = index
        initialY = e.clientY
        minOffsetY = weeksRef.current.children[0].offsetTop - weeksRef.current.children[dragTarget].offsetTop
        maxOffsetY = weeksRef.current.children[weeksRef.current.children.length - 1].offsetTop - weeksRef.current.children[dragTarget].offsetTop
        weeksRef.current.children[dragTarget].style.transition = 'box-shadow .3s, opacity .3s'
        weeksRef.current.children[dragTarget].style.zIndex = 1
        weeksRef.current.children[dragTarget].style.boxShadow = '0 0 4px gray'
        window.addEventListener('mousemove', registerDrag)
        window.addEventListener('mouseup', endDrag)
    }
    const endDrag = () => {
        window.removeEventListener('mouseup', endDrag)
        window.removeEventListener('mousemove', registerDrag)
        weeksRef.current.children[dragTarget].style.transition = 'box-shadow .3s, opacity .3s, transform .3s, z-index 0s .3s'
        weeksRef.current.children[dragTarget].style.boxShadow = '0 0 4px transparent'
        weeksRef.current.children[dragTarget].style.zIndex = 0
        weeksRef.current.children[dragTarget].style.transform = 'none'
        dragTarget = null
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
            {weeks.length < 4 && <Button onClick={() => changeWeek()}><i className="fas fa-plus" /></Button>}
        </div>
    )
}
import Button from "./Button"
import Text from "./Text"
import styles from '../styles/WeeksList.module.css'
import { useRef } from "react"

let dragTarget, initialMouseY, initialPositionY, positionY, minOffsetY, maxOffsetY, targetIndex, targetElement
export default function WeeksList({ weeks, setWeeks }) {
    const weeksRef = useRef()

    const registerDrag = (e) => {
        const offsetY = Math.min(maxOffsetY, Math.max(e.clientY - initialMouseY, minOffsetY))
        positionY = initialPositionY + offsetY

        targetIndex = 0
        targetElement = weeksRef.current.children[targetIndex]
        while (positionY > targetElement.offsetTop + targetElement.offsetHeight / 2) {
            targetIndex++
            targetElement = weeksRef.current.children[targetIndex]
        }

        for (let i = 0; i < weeksRef.current.children.length; i++) {
            if (i == dragTarget) {
                weeksRef.current.children[i].style.transform = `translateY(${offsetY}px)`
                weeksRef.current.children[i].style.transition = 'none'
            }
            else {
                if (i <= targetIndex && i > dragTarget) {
                    weeksRef.current.children[i].style.transform = `translateY(${-weeksRef.current.children[dragTarget].offsetHeight}px)`
                } else if (i >= targetIndex && i < dragTarget) {
                    weeksRef.current.children[i].style.transform = `translateY(${weeksRef.current.children[dragTarget].offsetHeight}px)`
                } else {
                    weeksRef.current.children[i].style.transform = 'none'
                }
                weeksRef.current.children[i].style.transition = 'transform .3s'
            }
        }
        console.log(dragTarget, targetIndex)
    }
    const startDrag = (e, index) => {
        dragTarget = index
        initialMouseY = e.clientY
        initialPositionY = weeksRef.current.children[dragTarget].offsetTop
        minOffsetY = weeksRef.current.children[0].offsetTop - initialPositionY
        maxOffsetY = weeksRef.current.children[weeksRef.current.children.length - 1].offsetTop - initialPositionY

        weeksRef.current.children[dragTarget].style.transition = 'box-shadow .3s, opacity .3s'
        weeksRef.current.children[dragTarget].style.zIndex = 1
        weeksRef.current.children[dragTarget].style.boxShadow = '0 0 4px gray'

        window.addEventListener('mousemove', registerDrag)
        window.addEventListener('mouseup', endDrag)
    }
    const endDrag = () => {
        window.removeEventListener('mouseup', endDrag)
        window.removeEventListener('mousemove', registerDrag)

        for (let i = 0; i < weeksRef.current.children.length; i++) {
            if (i == dragTarget) {
                weeksRef.current.children[i].style.boxShadow = '0 0 4px transparent'
                weeksRef.current.children[i].style.zIndex = 0
                const dragTargetElement = weeksRef.current.children[i]
                /*setTimeout(() => {
                    dragTargetElement.style.transition = 'box-shadow .3s, opacity .3s, z-index 0s .3s'
                    dragTargetElement.style.transform = `translateY(${positionY - weeksRef.current.children[targetIndex].offsetTop}px)`
                    setTimeout(() => {
                        dragTargetElement.style.transition = 'box-shadow .3s, opacity .3s, z-index 0s .3s, transform .3s'
                        dragTargetElement.style.transform = 'none'
                    }, 0)
                }, 0)*/
            } else {
                weeksRef.current.children[i].style.transition = 'none'
                weeksRef.current.children[i].style.transform = 'none'
            }
        }
        
        if (targetIndex != dragTarget) {
            setWeeks((oldWeeks) => {
                const weeks = [...oldWeeks]
                if (targetIndex < dragTarget) {
                    weeks.splice(dragTarget, 1)
                    weeks.splice(targetIndex, 0, oldWeeks[dragTarget])
                } else {
                    weeks.splice(targetIndex + 1, 0, oldWeeks[dragTarget])
                    weeks.splice(dragTarget, 1)
                }
                return weeks
            })
        }

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
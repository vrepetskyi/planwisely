import Button from "./Button"
import Text from "./Text"
import styles from '../styles/WeeksList.module.css'

export default function WeeksList({ weeks, setWeeks }) {
    const changeWeek = (id, value) => {
        setWeeks((oldWeeks) => {
            const weeks = [...oldWeeks]
            if (id == undefined) {
                console.log(1)
                let id = 0
                while (weeks.find(week => week.id == id)) id++
                weeks.push({ id, name: `Week ${weeks.length}` })
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
            {weeks.map((week) => {
                return (
                    <div key={week.id} className={styles.week}>
                        {weeks.length > 1 && <Button><i className="fas fa-bars" /></Button>}
                        <Text maxlength="32" value={week.name} setValue={(value) => changeWeek(week.id, value)} />
                        {weeks.length > 1 && <Button onClick={() => changeWeek(week.id)}><i className="fas fa-times" /></Button>}
                    </div>
                )
            })}
            {weeks.length < 4 && <Button onClick={() => changeWeek()}><i className="fas fa-plus" /></Button>}
        </div>
    )
}
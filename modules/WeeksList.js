import Button from "./Button"
import Text from "./Text"
import styles from '../styles/WeeksList.module.css'

export default function WeeksList({ weeks, setWeeks }) {
    const setWeek = (i, value) => {
        setWeeks((weeks) => {
            const newWeeks = [...weeks]
            if (i >= weeks.length) {
                newWeeks.push(`Week ${weeks.length + 1}`)
                return newWeeks
            }
            if (value) newWeeks[i] = value
            else if (weeks.length > 1) newWeeks.splice(i, 1)
            return newWeeks
        })
    }
    return (
        <div id={styles.container}>
            {weeks.map((week, i) => {
                return (
                    <div key={i} className={styles.week}>
                        { weeks.length > 1 && <Button><i className="fas fa-bars" /></Button> }
                        <Text maxlength="32" text={week} setText={(value) => setWeek(i, value)} />
                        { weeks.length > 1 && <Button onClick={() => setWeek(i)}><i className="fas fa-times" /></Button> }
                    </div>
                )
            })}
            { weeks.length < 4 && <Button onClick={() => setWeek(weeks.length)}><i className="fas fa-plus" /></Button> }
        </div>
    )
}
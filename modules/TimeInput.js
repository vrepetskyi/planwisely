import { useEffect, useState } from "react";
import Text from "./Text";
import Button from './Button'
import styles from '../styles/TimeInput.module.css'
import makeTwoDigit from "./makeTwoDigit";

export default function TimeInput({ time, setTime, maxTime, buttons }) {
    const [hours, setHours] = useState(0)
    const [minutes, setMinutes] = useState(0)

    useEffect(() => {
        if (time > maxTime) setTime(maxTime)
        else if (time < 0) setTime(0)
        else {
            setHours(Math.floor(time / 60))
            setMinutes(time % 60)
        }
    }, [time, maxTime])

    return (
        <div id={styles.container}>
            <div className={styles.block}>
                {buttons && <Button onClick={() => setTime(parseInt(time) + 60)}><i className="fas fa-caret-up" /></Button>}
                <Text maxlength="3" value={hours} setValue={(value) => setTime(value * 60 + (parseInt(minutes) || 0))} validator={(value) => value % 1 == 0 || value == '-' } format={makeTwoDigit} select updateOnBlur />
                {buttons && <Button onClick={() => setTime(parseInt(time) - 60)}><i className="fas fa-caret-down" /></Button>}
            </div>
            <span>:</span>
            <div className={styles.block}>
                {buttons && <Button onClick={() => setTime(parseInt(time) + 1)}><i className="fas fa-caret-up" /></Button>}
                <Text maxlength="5" value={minutes} setValue={(value) => setTime(hours * 60 + (parseInt(value) || 0))} validator={(value) => value % 1 == 0 || value == '-' } format={makeTwoDigit} select updateOnBlur />
                {buttons && <Button onClick={() => setTime(parseInt(time) - 1)}><i className="fas fa-caret-down" /></Button>}
            </div>
        </div>
    )
}
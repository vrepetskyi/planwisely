import Button from './Button'
import styles from '../styles/Question.module.css'

export default function Question({ question, info, options, colors, actions }) {
    return (
        <div id={styles.question}>
            <p>{question}</p>
            {info && <div id={styles.info}>{info.map((infoItem, index) => <p key={index} className={styles.infoItem}>{infoItem}</p>)}</div>}
            <div id={styles.options}>
                {options.map((option, index) => (
                    <Button
                        key={index}
                        style={{ '--color-hover': colors && index < colors.length && colors[index] }}
                        onClick={actions && index < actions.length ? actions[index] : null}
                    >{option}</Button>
                ))}
            </div>
        </div>
    )
}
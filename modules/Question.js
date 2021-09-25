import { useRouter } from 'next/dist/client/router'
import Button from './Button'
import styles from '../styles/Question.module.css'

export default function Question({ question, confirm, confirmStyle, onConfirm }) {
    const router = useRouter()
    return (
        <div id={styles.question}>
            <p>{question}</p>
            <div id={styles.choise}>
                <Button className={styles.button} style={confirmStyle} onClick={onConfirm}>{confirm}</Button>
                <Button className={styles.button} onClick={() => router.back()}>Cancel</Button>
            </div>
        </div>
    )
}
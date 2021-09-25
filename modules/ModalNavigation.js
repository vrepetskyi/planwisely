import Button from './Button'
import styles from '../styles/ModalNavigation.module.css'

export default function ModalNavigation({ title }) {
    return (
        <div id={styles.container}>
            <Button onClick={() => history.back()}><i className="fas fa-chevron-left" /></Button>
            <h1>{title}</h1>
            <Button><i className="fas fa-times" /></Button>
        </div>
    )
}
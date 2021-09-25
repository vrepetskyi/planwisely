import Button from './Button'
import styles from '../styles/ModalNavigation.module.css'

export default function ModalNavigation({title, showModal}) {
    return (
        <div id={styles.container}>
            <Button onClick={() => history.back()}><i className="fas fa-chevron-left" /></Button>
            <h1>{title}</h1>
            <Button onClick={() => showModal()}><i className="fas fa-times" /></Button>
        </div>
    )
}
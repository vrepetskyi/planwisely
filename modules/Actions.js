import styles from '../styles/Actions.module.css'

export default function Actions({ children }) {
    return (
        <div id={styles.actions}>
            {children}
        </div>
    )
}
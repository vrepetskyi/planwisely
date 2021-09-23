import styles from '../styles/Button.module.css'

export default function Button({ className, onClick, children }) {
    return (
        <button className={styles.button + " " + className} onClick={onClick}>
            {children}
        </button>
    )
}
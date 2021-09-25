import styles from '../styles/Button.module.css'

export default function Button({ className, onClick, children }) {
    return (
        <button className={styles.button + " " + (children.type == 'i' && styles.containingIcon) + " " + className} onClick={onClick}>
            {children}
        </button>
    )
}
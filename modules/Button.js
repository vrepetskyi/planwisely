import styles from '../styles/Button.module.css'

export default function Button({ className, style, onClick, children }) {
    return (
        <button className={styles.button + " " + (children.type == 'i' && styles.containingIcon) + " " + className} style={style} onClick={onClick}>
            {children}
        </button>
    )
}
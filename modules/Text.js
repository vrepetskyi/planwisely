import { useState } from 'react'
import styles from '../styles/Text.module.css'

let validationErrorTimeout
export default function Text({ text, setText, editable, multiline, maxlength, placeholder }) {
    const [validationError, setValidationError] = useState(false)
    const handleValidationError = () => {
        setValidationError(false)
        validationErrorTimeout = null
    }
    const handleChange = (e) => {
        const value = e.target.value
        if (value.length > maxlength) {
            setValidationError(true)
            if (validationErrorTimeout) {
                clearTimeout(validationErrorTimeout)
                validationErrorTimeout = setTimeout(handleValidationError, 50)
            } else validationErrorTimeout = setTimeout(handleValidationError, 500)
        }
        else setText(value)
    }
    return <input type="text" value={text} onChange={handleChange} placeholder={placeholder} className={styles.text + ' ' + (validationError && styles.validationError)} />
}
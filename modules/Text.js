import { useEffect, useState } from 'react'
import styles from '../styles/Text.module.css'

let validationErrorTimeout
export default function Text({ value, setValue, maxlength }) {
    const [validationError, setValidationError] = useState(false)
    const [buffer, setBuffer] = useState(value)

    const removeValidationError = () => {
        setValidationError(false)
        validationErrorTimeout = null
    }

    const handleChange = (e) => {
        const input = e.target.value
        if (input.length > maxlength || input.includes('  ') || input[0] == ' ') {
            setValidationError(true)
            if (validationErrorTimeout) {
                clearTimeout(validationErrorTimeout)
                validationErrorTimeout = setTimeout(removeValidationError, 50)
            } else validationErrorTimeout = setTimeout(removeValidationError, 500)
        } else {
            setBuffer(input)
            if (input) setValue(input)
        }
    }

    return (
        <input
            type="text"
            placeholder={value}
            value={buffer}
            onChange={handleChange}
            onKeyDown={(e) => { if (e.key == 'Backspace' && !buffer) setValue() }}
            onBlur={() => setBuffer(value.trim())}
            className={`${styles.text} ${validationError && styles.validationError}`}
        />
    )
}
import { useEffect, useState } from 'react'
import styles from '../styles/Text.module.css'

let validationErrorTimeout, lastValue
export default function Text({ value, setValue, maxlength, validator, format: modify, select, updateOnBlur }) {
    const valid = (value) => !(value.length > maxlength || value.toString().includes('  ') || value.toString()[0] == ' ' || (typeof validator === 'function' && !validator(value)))
    const format = (value) => typeof modify == 'function' ? modify(value.toString().trim()) : value.toString().trim()
    
    const [validationError, setValidationError] = useState(false)
    const [buffer, setBuffer] = useState(format(value))
    
    const addValidationError = () => {
        setValidationError(true)
        if (validationErrorTimeout) {
            clearTimeout(validationErrorTimeout)
            validationErrorTimeout = setTimeout(removeValidationError, 50)
        } else validationErrorTimeout = setTimeout(removeValidationError, 500)
    }
    
    const removeValidationError = () => {
        setValidationError(false)
        validationErrorTimeout = null
    }

    useEffect(() => {
        if (value != undefined && value != null && buffer != undefined && buffer != null && value != buffer) {
            if (valid(value)) setBuffer(format(value))
            else {
                addValidationError()
                setValue(lastValue)
            }
        }
    }, [value])

    const handleChange = (e) => {
        const input = e.target.value
        if (valid(input)) {
            setBuffer(input)
            if (!updateOnBlur && input) {
                setValue(input)
                lastValue = input
            }
        } else addValidationError()
    }

    return (
        <input
            type="text"
            placeholder={value.toString()}
            value={buffer}
            onClick={select ? (e) => e.target.select() : undefined}
            onChange={handleChange}
            onFocus={() => setBuffer(value)}
            onBlur={() => {
                if (updateOnBlur && buffer) {
                    setValue(buffer)
                    lastValue = buffer
                }
                setBuffer(format(value))}
            }
            className={`${styles.text} ${validationError && styles.validationError}`}
        />
    )
}
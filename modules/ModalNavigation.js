import { useRouter } from 'next/dist/client/router'
import Button from './Button'
import styles from '../styles/ModalNavigation.module.css'

export default function ModalNavigation({ title }) {
    const router = useRouter()
    return (
        <div id={styles.container}>
            <Button onClick={() => router.back()}><i className="fas fa-chevron-left" /></Button>
            <h1>{title}</h1>
            <Button onClick={() => router.push('/', undefined, { shallow: true })}><i className="fas fa-times" /></Button>
        </div>
    )
}
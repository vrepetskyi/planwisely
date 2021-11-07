import Button from './Button'
import styles from '../styles/Templates.module.css'
import { useGlobalState } from './GlobalState'
import { useRouter } from 'next/dist/client/router'
import makeTwoDigit from './makeTwoDigit'

export default function Templates() {
    const { plan, setPlan } = useGlobalState()
    const router = useRouter()
    return (
        <div id={styles.container}>
            {plan.templates && plan.templates.map((template, index) => (
                <Button
                    key={index}
                    className={styles.template}
                    onClick={() => router.push('/template/' + template?.id, undefined, { shallow: true })}>
                    <p>{template.name}</p>
                    <p>
                        {template.duration ? `${Math.floor(template.duration / 60)}h ${template.duration % 60}m` : null}
                        {template.duration && template.snaps.length ? ' | ' : null}
                        {template.snaps.length ? template.snaps.map((snap) => makeTwoDigit(Math.floor(snap / 60)) + ':' + makeTwoDigit(snap % 60)).join(' ') : null}
                    </p>
                </Button>
            ))}
            <Button id={styles.add} onClick={() => {
                let id = 0
                while (plan.templates.find(template => template.id == id)) id++
                setPlan({ ...plan, templates: [...plan.templates, { id, name: 'New Template', duration: 0, snaps: [] }] })
                router.push('/template/' + id, undefined, { shallow: true })
            }
            }><i className="fas fa-plus" /></Button>
        </div>
    )
}
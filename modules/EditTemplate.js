import { useRouter } from "next/dist/client/router"
import Actions from "./Actions"
import Button from './Button'
import { useModalPlan } from "./Modal"
import Text from "./Text"
import TimeInput from "./TimeInput"
import styles from '../styles/EditTemplate.module.css'
import { useEffect, useState } from "react"

export default function EditTemplate({ id }) {
    const [plan, setPlan] = useModalPlan()
    const index = plan.templates.findIndex((template) => template.id == id)
    const router = useRouter()
    return (
        <div>
            <div id={styles.inputs}>
                <div id={styles.name}>
                    <span style={{ marginRight: '8px' }}>Name:</span>
                    <Text maxlength="32" value={plan?.templates[index]?.name} setValue={(value) => {
                        const templates = plan.templates
                        templates[index].name = value
                        setPlan({ ...plan, templates })
                    }} />
                </div>
                <div id={styles.duration}>
                    <span>Duration:</span>
                    <TimeInput time={plan.templates[index].duration || 0} setTime={(value) => {
                        const templates = plan.templates
                        templates[index].duration = value
                        setPlan({ ...plan, templates })
                    }} maxTime="720" buttons />
                </div>
                {plan.templates[index].snaps && <div id={styles.snaps}>
                    <span>Snaps:</span>
                    {plan.templates[index].snaps.map((snap, i) => (
                        <div key={i}>
                            <TimeInput time={snap} setTime={(value) => {
                                const snaps = plan.templates[index].snaps
                                snaps[i] = value
                                snaps.sort()
                                setPlan({ ...plan, snaps })
                            }} maxTime="1439" />
                            <Button onClick={() => {
                                const snaps = plan.templates[index].snaps
                                snaps.splice(i, 1)
                                setPlan({ ...plan, snaps })
                            }}><i className="fas fa-times" /></Button>
                        </div>
                    ))}
                    <Button onClick={() => {
                        const snaps = plan.templates[index].snaps
                        snaps.unshift(0)
                        setPlan({ ...plan, snaps })
                    }}><i className="fas fa-plus" /></Button>
                </div>}
            </div>
            <Actions>
                <Button hoverColor="rgb(0, 0, 0, .8)" onClick={() => router.push('/', undefined, { shallow: true })}>Ok</Button>
                <Button hoverColor="rgb(200, 0, 0" onClick={() => {
                    const templates = plan.templates
                    templates.splice(index, 1)
                    setPlan({ ...plan, templates })
                    router.push('/', undefined, { shallow: true })
                }}>Delete</Button>
            </Actions>
        </div>
    )
}
import { createContext, useContext, useState, useEffect } from 'react'
import { useRouter } from 'next/dist/client/router'
import { useSession } from 'next-auth/react'
import axios from 'axios'

const defaultPlan = {
    templates: [{
        id: 0,
        name: 'Sleep',
        duration: 480,
        snaps: [0, 1320, 1380]
    }, {
        id: 1,
        name: 'Study',
        duration: 90,
        snaps: [520, 635, 740, 845]
    }, {
        id: 2,
        name: 'Gym',
        duration: 60,
        snaps: [1080, 1140, 1200]
    }, {
        id: 3,
        name: 'Work at DataArt',
        duration: 480,
        snaps: [600, 660, 720]
    }],
    weeks: [{
        id: 0,
        name: 'Week 1'
    }, {
        id: 1,
        name: 'Week 2'
    }],
    origin_week_id: 0
}

const StateContext = createContext()

export const useGlobalState = () => useContext(StateContext)

export const GlobalStateProvider = ({ children, message, plan, error }) => {
    const [state, setState] = useState({ message, error, plan: { ...defaultPlan, ...plan } })
    const router = useRouter()
    const { status } = useSession()
    
    const setPlan = async (plan) => {
        setState({ ...state, plan: { ...plan } })
        try {
            if (status == 'authenticated') await axios.post(`${router.basePath}/api/database`, plan)
            else if (status == 'unauthenticated') localStorage.setItem('plan', JSON.stringify(plan))
        } catch (error) {
            console.log(error.response?.data)
            if (error.response?.status == 502) localStorage.setItem('plan', JSON.stringify(plan))
            else router.reload()
        }
    }

    // pull plan from local storage if not authorized or cloud is empty
    useEffect(() => {
        if (localStorage.plan && (status == 'unauthenticated' || status == 'authenticated' && !plan)) {
            setState({ ...state, plan : { ...state.plan, ...JSON.parse(localStorage.plan) } })
            delete localStorage.plan
            router.replace('/', undefined, { shallow: true })
        }
    }, [status])

    return (
        <StateContext.Provider value={{ state, plan: state.plan, setState, setPlan }}>
            { children }
        </StateContext.Provider>
    )
}
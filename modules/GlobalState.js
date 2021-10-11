import { createContext, useContext, useState, useEffect } from 'react'
import { useRouter } from 'next/dist/client/router'
import { useSession } from 'next-auth/react'
import axios from 'axios'

const defaultPlan = {
    weeks: [{
        id: 0,
        name: 'Week 1'
    }, {
        id: 1,
        name: 'Week 2'
    }],
    origin_week_id: 0
}

const GlobalStateContext = createContext()

export const useGlobalState = () => useContext(GlobalStateContext)

export const GlobalStateProvider = ({ children, message, plan, error }) => {
    const [state, setState] = useState({ message, error, plan: { ...defaultPlan, ...plan } })
    const router = useRouter()
    const { status } = useSession()
    
    const changeState = async (newState) => {
        setState(newState)
        try {
            if (status == 'authenticated') await axios.post(`${router.basePath}/api/database`, newState.plan)
            else if (status == 'unauthenticated') localStorage.setItem('plan', JSON.stringify(newState.plan))
        } catch (error) {
            console.log(error.response?.data)
            if (error.response?.status == 502) localStorage.setItem('plan', JSON.stringify(newState.plan))
            else router.reload()
        }
    }

    // pull plan from local storage if not authorized or cloud is empty
    useEffect(() => {
        if (localStorage.plan && (status == 'unauthenticated' || status == 'authenticated' && !plan)) {
            changeState({ ...state, plan : { ...state.plan, ...JSON.parse(localStorage.plan) } })
            delete localStorage.plan
            router.replace('/', undefined, { shallow: true })
        }
    }, [status])

    return (
        <GlobalStateContext.Provider value={[state, changeState]}>
            { children }
        </GlobalStateContext.Provider>
    )
}
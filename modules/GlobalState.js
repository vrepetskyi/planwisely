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

    // pull plan from local storage if not authorized or cloud is empty
    useEffect(() => {
        if ('plan' in localStorage && (status == 'unauthenticated' || status == 'authenticated' && !plan)) {
            setState(JSON.parse(localStorage.plan))
            delete localStorage.plan
        }
    }, [status])

    const changeState = async (newState) => {
        try {
            console.log(state, newState)
            if (status == 'authenticated') await axios.post(`${router.basePath}/api/database`, newState)
            else if (status == 'unauthenticated') localStorage.setItem('plan', JSON.stringify(newState))
        } catch (error) {
            console.log(error.response?.data)
            if (error.response?.status == 502) localStorage.setItem('plan', newState)
            else router.reload()
        }
        setState(newState)
    }
    
    return (
        <GlobalStateContext.Provider value={[state, changeState]}>
            { children }
        </GlobalStateContext.Provider>
    )
}
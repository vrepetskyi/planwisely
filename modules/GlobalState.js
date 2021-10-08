import { createContext, useContext, useState } from 'react'
import { useRouter } from 'next/dist/client/router'
import axios from 'axios'

const GlobalStateContext = createContext()

export const useGlobalState = () => useContext(GlobalStateContext)

export const GlobalStateProvider = ({ children, ...props }) => {
    const [state, setState] = useState({ ...props })
    const router = useRouter()
    const changeState = async (newState) => {
        try {
            await axios.post(`${router.basePath}/api/database`, newState)
        } catch (error) {
            console.log(error.response.data)
            router.reload()
        }
        setState(newState)
    }
    return (
        <GlobalStateContext.Provider value={[state, changeState]}>
            { children }
        </GlobalStateContext.Provider>
    )
}
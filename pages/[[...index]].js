import { useRouter } from 'next/dist/client/router'
import { useEffect, useState } from 'react'
import { signOut, useSession } from 'next-auth/react'
import Settings from '../modules/Settings'
import Question from '../modules/Question'
import Head from 'next/head'
import Header from '../modules/Header'
import Modal from '../modules/Modal'
import axios from 'axios'
import { useGlobalState } from '../modules/GlobalState'

export default function Home() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [globalState, setGlobalState] = useGlobalState()

  const [modal, setModal] = useState()
  useEffect(() => {
    if (status != 'loading') {
      // stick to specific route
      const targetLocation = status == 'authenticated' && 'plan' in localStorage ? '/source/' : false
      if (targetLocation && !router.asPath.startsWith(targetLocation)) router.replace(targetLocation, undefined, { shallow: true })
      else if (router.asPath.includes('#')) router.replace(window.location.pathname, undefined, { shallow: true })
      // update modal on route change
      setModal({
        content: (() => {
          switch (router.query?.index && router.query.index[0]) {
            case 'settings':
              return <Settings />
            case 'delete':
              if (session) return (
                <Question
                  question='Delete the plan? Action cannot be undone'
                  options={['Delete', 'Cancel']}
                  colors={['#F44']}
                  actions={[
                    async () => {
                      try {
                        await axios.delete('/api/database')
                        signOut()
                      } catch (error) {
                        console.log(error.response.data)
                      }
                    },
                    () => router.back()
                  ]}
                />
              )
            case 'source':
              if (targetLocation == '/source/')
                switch (router.query.index.length > 1 && router.query.index[1]) {
                  case 'local':
                    return (
                      <Question
                        question='Use local data?'
                        info={[
                          `Weeks: ${JSON.parse(localStorage.plan).weeks.map((week) => week.name).join(', ')}`
                        ]}
                        options={['Yes', 'No']}
                        colors={['green']}
                        actions={[
                          () => {
                            setGlobalState({ ...globalState, plan : { ...globalState.plan, ...JSON.parse(localStorage.plan) } })
                            delete localStorage.plan
                            router.replace('/', undefined, { shallow: true })
                          },
                          () => router.push('/source/', undefined, { shallow: true })
                        ]}
                      />
                    )
                  case 'cloud':
                    return (
                      <Question
                        question='Use cloud data?'
                        info={[
                          `Weeks: ${globalState.plan.weeks.map((week) => week.name).join(', ')}`
                        ]}
                        options={['No', 'Yes']}
                        colors={[undefined, 'purple']}
                        actions={[
                          () => router.push('/source/', undefined, { shallow: true }),
                          () => {
                            delete localStorage.plan
                            router.replace('/', undefined, { shallow: true })
                          }
                        ]}
                      />
                    )
                  default:
                    return (
                      <Question
                        question='Which source to use?'
                        info={["You'll see a preview"]}
                        options={['Local', 'Cloud']}
                        colors={['green', 'purple']}
                        actions={[
                          () => router.push('/source/local', undefined, { shallow: true }),
                          () => router.push('/source/cloud', undefined, { shallow: true })
                        ]}
                      />
                    )
                }
          }
        })(),
        canClose: !(targetLocation || status == 'loading')
      })
    }
  }, [status, router.asPath])
  
  if (status == 'loading') return null

  return (
    <>
      <Head>
        <title>planwisely</title>
      </Head>
      <Header />
      <Modal content={modal?.content} canClose={modal?.canClose} />
    </>
  )
}

export async function getServerSideProps(context) {
  try {
    const response = await axios.get(`http://${context.req.headers.host}/api/database`, { headers: { cookie: context.req.headers.cookie } })
    if (response.data instanceof Object) return { props: { plan: { ...response.data } } }
    else return { props: { message: response.data } }
  } catch (error) {
    console.log(error.message)
    return { props: { error: 'Unable to reach the database. Changes will be stored locally' } }
  }
}

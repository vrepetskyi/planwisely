import { useRouter } from 'next/dist/client/router'
import { useEffect } from 'react'
import { signOut, useSession, } from 'next-auth/react'
import Settings from '../modules/Settings'
import Question from '../modules/Question'
import Head from 'next/head'
import Header from '../modules/Header'
import Modal from '../modules/Modal'
import axios from 'axios'

export default function Home() {
  const router = useRouter()
  useEffect(() => {
    if (router.asPath.includes('#')) {
      router.replace(window.location.pathname, undefined, { shallow: true })
    }
  })

  const { data:session, status } = useSession()
  if (status == 'loading') return null

  let modalContent
  if ('index' in router.query) {
    const queryType = router.query.index[0]
    switch (queryType) {
      case 'settings':
        modalContent = <Settings />
        break
      case 'delete':
        if (session) {
          modalContent = <Question
            question="Delete the plan? Action cannot be undone"
            confirm="Delete"
            confirmStyle={{ backgroundColor: 'var(--color-attention)' }}
            onConfirm={async () => {
              try {
                await axios.delete(`${router.basePath}/api/database`)
                signOut()
              } catch (error) {
                console.log(error.response.data)
              }
            }}
          />
        }
    }
  }

  return (
    <>
      <Head>
        <title>planwisely</title>
      </Head>
      <Header />
      <Modal>
        {modalContent}
      </Modal>
    </>
  )
}

export async function getServerSideProps(context) {
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
  console.log(1)
  try {
    const response = await axios.get(`http://${context.req.headers.host}/api/database`, { headers: { cookie: context.req.headers.cookie } })
    try {
      //const plan = JSON.parse(response.data)
      console.log('from server', response.data)
      return { props: { ...defaultPlan, ...response.data } }
    } catch {
      return { props: defaultPlan }
    }
  } catch (error) {
    console.log(error.message)
    return { props: { ...defaultPlan, message: 'Unable to reach the database. Changes will be stored locally' } }
  }
}

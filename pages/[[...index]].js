import { useRouter } from 'next/dist/client/router'
import { useEffect } from 'react'
import { useSession, getSession } from 'next-auth/react'
import Settings from '../modules/Settings'
import Question from '../modules/Question'
import Head from 'next/head'
import Header from '../modules/Header'
import Modal from '../modules/Modal'

export default function Home() {
  const router = useRouter()
  useEffect(() => {
    if (router.asPath.includes('#')) {
      router.replace(window.location.pathname, undefined, { shallow: true })
    }
  })

  const { status } = useSession()
  if (status == 'loading') return null

  let modalContent
  if ('index' in router.query) {
    const queryType = router.query.index[0]
    switch (queryType) {
      case 'settings':
        modalContent = <Settings />
        break
      case 'delete':
        modalContent = <Question question="Delete the plan? Action cannot be undone" confirm="Delete" confirmStyle={{backgroundColor: 'var(--color-attention)'}} />
      default:
        if (router.query.index.length > 1) {
          const queryId = router.query.index[1]
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

import axios from 'axios'

export async function getServerSideProps(context) {
  const defaultPlan = {
    selectedWeekId: 0,
    weeks: [{
        id: 0,
        name: 'Week 1'
    }, {
        id: 1,
        name: 'Week 2'
    }]
  }

  try {
    const response = await axios.get(`http://${context.req.headers.host}/api/database`, { headers: { cookie: context.req.headers.cookie } })
    return { props: { ...defaultPlan, ...response.data } }
  } catch (error) {
    console.log(error.message)
    return { props: { ...defaultPlan, message: 'Unable to reach the database. Changes will be stored locally' } }
  }
}

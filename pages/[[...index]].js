import { useRouter } from 'next/dist/client/router'
import { useEffect } from 'react'
import { useSession } from 'next-auth/client'
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

  const [session, loading] = useSession()
  if (typeof window !== 'undefined' && loading) return null

  let modalContent
  if ('index' in router.query) {
    const queryType = router.query.index[0]
    switch (queryType) {
      case 'settings':
        modalContent = <Settings />
        break
      case 'delete':
        modalContent = <Question question="Delete the plan? Action cannot be undone" confirm="Delete" confirmStyle={{backgroundColor: '#ea7474'}} />
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

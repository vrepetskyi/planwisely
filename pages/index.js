import Head from 'next/head'
import Header from '../modules/Header'
import ModalContainer, { useModal } from '../modules/Modal'

export default function Home() {
  const [isVisible, content, showModal] = useModal()
  return (
    <>
    <Head>
      <title>planwisely</title>
    </Head>
    <Header isVisible={isVisible} content={content} showModal={showModal} />
    <ModalContainer isVisible={isVisible} content={content} showModal={showModal} />
    </> 
  )
}

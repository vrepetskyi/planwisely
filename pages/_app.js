import Script from 'next/script'
import { useState } from 'react'
import { Provider } from 'next-auth/client'
import Modal, { ModalContext } from '../modules/Modal'
import '../styles/globals.css'

export default function MyApp({ Component, pageProps }) {
  const [content, setModal] = useState()
  return (
    <>
    <Script src="https://kit.fontawesome.com/d7252dcce3.js" crossOrigin="anonymous" />
    <ModalContext.Provider value={setModal}>
      <Provider session={pageProps.session}>
        <Component {...pageProps} />
      </Provider>
    </ModalContext.Provider>
    <Modal content={content} setModal={setModal} />
    </>
  )
}
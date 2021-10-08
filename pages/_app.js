import Script from 'next/script'
import { SessionProvider } from 'next-auth/react'
import '../styles/globals.css'
import { GlobalStateProvider } from '../modules/GlobalState'

export default function MyApp({
  Component,
  pageProps: { session, ...pageProps }
}) {
  return (
    <>
      <Script src="https://kit.fontawesome.com/d7252dcce3.js" crossOrigin="anonymous" />
      <SessionProvider session={session}>
        <GlobalStateProvider {...pageProps}>
          <Component />
        </GlobalStateProvider>
      </SessionProvider>
    </>
  )
}
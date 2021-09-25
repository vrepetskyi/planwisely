import Script from 'next/script'
import { Provider } from 'next-auth/client'
import '../styles/globals.css'

export default function MyApp({ Component, pageProps }) {
  return (
    <>
      <Script src="https://kit.fontawesome.com/d7252dcce3.js" crossOrigin="anonymous" />
      <Provider session={pageProps.session}>
        <Component {...pageProps} />
      </Provider>
    </>
  )
}
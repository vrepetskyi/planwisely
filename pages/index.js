import { useSession, signIn, signOut } from 'next-auth/client'
import styles from '../styles/Home.module.css'

export default function Home() {
  const [session] = useSession()
  if (session) {
    return (
      <>
        Signed in as {session.user.name} <br />
        <button onClick={() => signOut('google')}>Sign out</button>
      </>
    )
  }
  return (
    <>
      Not signed in <br />
      <button onClick={() => signIn('google')}>Sign in</button>
    </>
  )
}

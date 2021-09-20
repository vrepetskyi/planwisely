import { getSession } from 'next-auth/client'
import { pg } from '../../postgres'

export default async (req, res) => {
  const session = await getSession({ req })
  if (session) {
    switch (req.method) {
      case 'GET':
        const plan = {
          userId: await pg.query(`SELECT id FROM users WHERE email = ${session.user.email}`)
        }
        console.log(plan)
        res.status(200).end()
        break;
      case 'POST':
        res.status(200).end()
        break;
      case 'DELETE':
        res.status(200).end()
        break;
      default:
        res.status(404).send('Invalid request')
    }
  } else if (req.method == 'GET')
    res.status(401).send('Authorization needed')
  else
    res.status(404).send('Invalid request')
}
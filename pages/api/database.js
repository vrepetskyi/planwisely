import { getSession } from 'next-auth/react'
import { pg } from '../../postgres'

export default async (req, res) => {
  console.log(req.headers)
  const session = await getSession({ req })
  try {
    const planRequest = await pg.query('SELECT * FROM plans WHERE email = $1', [session?.user.email])
    if (session) {
      if (planRequest.rows) { // existing plan found
        switch (req.method) {
          case 'GET':
            res.status(200).json(planRequest.rows[0])
            break
          case 'POST':
            const updateResponse = await pg.query('UPDATE plans SET weeks = $1 WHERE id = $2', [JSON.stringify(req.body.weeks), planRequest.rows[0].id])
            res.status(201).send('Plan updated')
            //res.status(400).send('Validation failed')
            break
          default:
            res.status(400).send('Bad request')
        }
      }
      else { // create blank plan
        const newPlanRequest = await pg.query('INSERT INTO plans (email) VALUES ($1)', [session.user.email])
        res.status(201).json(newPlanRequest)
      }
    } else res.status(200).send('Database is online')
  } catch (error) {
    console.log(error)
    res.status(502).send('Database is offline')
  }
}
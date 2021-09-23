import { getSession, session } from 'next-auth/client'
import { pg } from '../../postgres'

export default async (req, res) => {
  let planId = 0;

  const session = await getSession({ req })
  if (session) {
    try {
      const plansRes = pg.query('SELECT * FROM plans WHERE scope=$1', [session.user.email])
      planId = plansRes.rows[0].id
    } catch (err) {
      console.log(err.message)
    }
  }

  if (req.method == 'GET' || planId == 0) {
    try {
      const plan = {
        templates: (await pg.query('SELECT * FROM templates WHERE plan_id = $1', [planId])).rows,
        events: (await pg.query('SELECT * FROM events WHERE plan_id = $1', [planId])).rows,
        info_types: (await pg.query('SELECT * FROM info_types WHERE plan_id = $1', [planId])).rows,
        info_values: (await pg.query('SELECT * FROM info_values WHERE plan_id = $1', [planId])).rows,
        template_info: (await pg.query('SELECT * FROM template_info WHERE plan_id = $1', [planId])).rows,
      }
      res.status(200).json(plan)
    } catch (err) {
      res.status(500).send(err.message)
    }
  }

  if (planId != 0) {
    switch (req.method) {
      case 'POST':
        break
      case 'DELETE':
        break
      default:
        res.status(404).send('Invalid request')
    }
  }
}
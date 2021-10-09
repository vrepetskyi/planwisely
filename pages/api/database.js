import { getSession } from 'next-auth/react'
import { pg } from '../../postgres'

export default async (req, res) => {
  const session = await getSession({ req })
  try {
    const planRequest = await pg.query('SELECT * FROM plans WHERE email = $1', [session?.user.email])
    if (session) {
      if (planRequest.rows.length) { // existing plan found
        const plan = planRequest.rows[0]
        switch (req.method) {
          case 'GET':
            res.status(200).json(Object.fromEntries(Object.entries(plan).filter(([key, value]) => value != null && key != 'id' && key != 'email')))
            break
          case 'POST':
            try { // parse request body
              const parsedRequestBody = Object.fromEntries(Object.entries(req.body).filter(([key, value]) => {
                if (!value) return false // filter null values
                switch (key) { // filter key names
                  case 'weeks':
                    const weekIds = []
                    return (
                      value.length > 0 && value.length < 5 && // validate quantity
                      value.every(week => { // validate each week
                        if (
                          Number.isInteger(week.id) && week.id >= 0 && // id >= 0
                          weekIds.indexOf(week.id) == -1 && // id is unique
                          week.name.length <= 32 && // name not longer than 32
                          !week.name.includes('  ') && // no double spaces
                          week.name[0] != ' ' && week.name[week.name.length - 1] != ' ' // no spaces at the start and end of name 
                        ) {
                          weekIds.push(week.id) // push validated week id
                          return true
                        }
                        else return false
                      }))
                  default:
                    return false
                }
              }))
              if ('weeks' in parsedRequestBody) { // parse origin week
                if (parsedRequestBody.weeks.findIndex(week => week.id == req.body?.origin_week_id) != -1)
                  parsedRequestBody.origin_week_id = parseInt(req.body.origin_week_id)
                else
                  parsedRequestBody.origin_week_id = parsedRequestBody.weeks[0].id
              }
              try { // update plan
                if ('weeks' in parsedRequestBody) {
                  await pg.query('UPDATE plans SET weeks = $1, origin_week_id = $2, origin_date = CURRENT_DATE WHERE id = $3', [JSON.stringify(parsedRequestBody.weeks), parsedRequestBody.origin_week_id, plan.id])
                }
                res.status(201).send('Plan was updated')
              } catch (error) {
                console.log(error)
                res.status(502).send('Error during plan update')
              }
            } catch (error) {
              console.log(error)
              res.status(400).send('Validation failed')
            }
            break
          case 'DELETE':
            try {
              await pg.query('DELETE FROM plans WHERE id = $1', [plan.id])
              res.status(200).send('Plan was deleted')
            } catch (error) {
              console.log(error)
              res.status(502).send("Plan wasn't deleted")
            }
            break
          default:
            res.status(400).send('Bad request')
        }
      }
      else { // create blank plan
        try {
          await pg.query('INSERT INTO plans (email) VALUES ($1)', [session.user.email])
          res.status(201).send('Plan was created')
        } catch (error) {
          console.log(error)
          res.status(502).send("Plan wasn't created")
        }
      }
    } else res.status(200).send('Database is online')
  } catch (error) {
    console.log(error)
    res.status(502).send('Database is offline')
  }
}
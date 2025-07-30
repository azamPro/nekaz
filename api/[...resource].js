// api/[...resource].js
import fs from 'fs/promises'
import path from 'path'

export default async function handler(req, res) {
  // e.g. GET /api/users → resource = ['users']
  const [resource] = req.query.resource  
  const dbPath = path.join(process.cwd(), 'db.json')
  const db = JSON.parse(await fs.readFile(dbPath, 'utf8'))

  if (!db[resource]) {
    return res.status(404).json({ error: 'Not Found' })
  }

  // you can add paging, filtering, POST/PUT handlers here if you like
  return res.status(200).json(db[resource])
}

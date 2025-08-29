import type { Handler } from '@netlify/functions'
import { neon } from '@neondatabase/serverless'

// Expected env vars: NEON_DATABASE_URL
// Example table:
// CREATE TABLE leads (
//   id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
//   first_name text,
//   last_name text,
//   company text,
//   email text,
//   standards text,
//   created_at timestamptz DEFAULT now()
// );

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' }
  }

  try {
    const { firstName, lastName, companyName, workEmail, standards } = JSON.parse(event.body || '{}')
    if (!firstName || !lastName || !companyName || !workEmail) {
      return { statusCode: 400, body: 'Missing required fields' }
    }

    const sql = neon(process.env.NEON_DATABASE_URL as string)
    await sql(
      `INSERT INTO leads (first_name, last_name, company, email, standards)
       VALUES ($1, $2, $3, $4, $5)`,
      [firstName, lastName, companyName, workEmail, Array.isArray(standards) ? standards.join(',') : String(standards || '')]
    )

    return { statusCode: 200, body: JSON.stringify({ ok: true }) }
  } catch (err) {
    console.error(err)
    return { statusCode: 500, body: 'Server Error' }
  }
}

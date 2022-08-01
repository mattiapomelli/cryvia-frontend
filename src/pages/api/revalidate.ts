import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'GET') {
    // Check for secret to confirm this is a valid request
    if (req.query.secret !== process.env.REVALIDATE_TOKEN) {
      return res.status(401).json({ message: 'Invalid token' })
    }

    try {
      // this should be the actual path not a rewritten path
      // e.g. for "/blog/[slug]" this should be "/blog/post-1"

      const quizId = req.query.quizId?.toString()
      const path = quizId ? `/quizzes/${quizId}` : '/'

      await res.revalidate(path)
      return res.json({ path, revalidated: true })
    } catch (err) {
      // If there was an error, Next.js will continue
      // to show the last successfully generated page
      return res.status(500).send('Error revalidating')
    }
  } else {
    res.status(405).send('Method not allowed')
  }
}

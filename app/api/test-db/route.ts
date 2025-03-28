import { NextApiRequest, NextApiResponse } from 'next'
import {prisma} from '@/lib/prisma'

export async function GET(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const users = await prisma.user.findMany()
    res.status(200).json({ users })
  } catch (error) {
    console.error('Database test error:', error)
    res.status(500).json({ error: 'Database connection failed' })
  }
}

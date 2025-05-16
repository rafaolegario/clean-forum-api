import { config } from 'dotenv'
import { PrismaClient } from 'generated/prisma'
import { execSync } from 'node:child_process'
import { randomUUID } from 'node:crypto'

const prisma = new PrismaClient()
config({ path: '.env', override: true })
config({ path: '.env.test', override: true })

function generateUniqueDatabaseUrl(schemaId: string) {
  if(!process.env.DATABASE_URL){ //eslint-disable-line
    throw new Error('Please provider a DATABASE_URL enviroment variable')
  }
  const url = new URL(process.env.DATABASE_URL)

  url.searchParams.set('schema', schemaId)

  return url.toString()
}

const schemaId = randomUUID()

beforeAll(async () => {
  const databaseUrl = generateUniqueDatabaseUrl(schemaId)

  process.env.DATABASE_URL = databaseUrl

  execSync('npx prisma migrate deploy')
})
afterAll(async () => {
  await prisma.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${schemaId}" CASCADE`)
  await prisma.$disconnect()
})

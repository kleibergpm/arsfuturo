import { PrismaClient } from "./generated/client/index.js"
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL
if (!connectionString) throw new Error ('Connection string must be specified') 

const adapter = new PrismaPg({ connectionString })
export const prisma = new PrismaClient({ adapter })


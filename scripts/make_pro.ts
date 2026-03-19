import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const users = await prisma.user.findMany({
    include: { subscription: true }
  })
  for (const user of users) {
    console.log(`User: ${user.firstname}, Plan: ${user.subscription?.plan}`)
    if (user.subscription?.plan !== 'PRO') {
       console.log(`Updating ${user.firstname} to PRO...`)
       await prisma.subscription.upsert({
         where: { userId: user.id },
         update: { plan: 'PRO' },
         create: { userId: user.id, plan: 'PRO' }
       })
    }
  }
}
main().catch(console.error).finally(() => prisma.$disconnect())

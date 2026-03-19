import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const automations = await prisma.automation.findMany({
    include: {
      trigger: true,
      keywords: true,
      listener: true,
      posts: true,
      User: {
        include: {
          integrations: true,
        }
      }
    }
  })
  console.log("Total Automations:", automations.length)
  automations.forEach(a => {
    console.log(`- Automation: ${a.name} (ID: ${a.id})`)
    console.log(`  - Triggers: ${a.trigger.map(t => t.type).join(", ")}`)
    console.log(`  - Keywords: ${a.keywords.map(k => k.word).join(", ")}`)
    console.log(`  - Posts count: ${a.posts.length}`)
    console.log(`  - User: ${a.User?.firstname} (Token: ${a.User?.integrations[0]?.token ? "exists" : "missing"})`)
  })
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect())

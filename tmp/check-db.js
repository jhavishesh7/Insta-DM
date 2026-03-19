const { PrismaClient } = require('@prisma/client');
const client = new PrismaClient();

async function main() {
  const users = await client.user.findMany({
    include: { integrations: true, automations: true }
  });
  for (const u of users) {
     console.log(`User ${u.clerkId} (${u.id}): Integrations=${u.integrations.length}, Automations=${u.automations.length}`);
  }
}
main().finally(() => client.$disconnect());

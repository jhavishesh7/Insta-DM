const { PrismaClient } = require('@prisma/client');
const client = new PrismaClient();

async function main() {
  const CORRECT_ID = "17841440051680731";
  const updated = await client.integrations.updateMany({
    data: { instagramId: CORRECT_ID }
  });
  console.log("Updated integrations:", updated.count);
}
main().finally(() => client.$disconnect());

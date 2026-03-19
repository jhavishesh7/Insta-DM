import { client } from "@/lib/prisma";

async function main() {
  const users = await client.user.findMany({
    include: {
      integrations: true,
      personalAssistant: true,
    }
  });
  console.log(JSON.stringify(users, null, 2));
}
main();

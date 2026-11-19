import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // 1. Admin Account
  const admin = await prisma.user.upsert({
    where: { username: "admin" },
    update: {},
    create: {
      full_name: "System Administrator",
      username: "admin",
      email: "admin@gateway.com",
      password: "admin123",
      level: "Admin",
      status: "Active",
    },
  });
  console.log("Admin seeded:", admin.username);

  // 2. Member Account
  const member = await prisma.user.upsert({
    where: { username: "member" },
    update: {},
    create: {
      full_name: "Demo Member VIP",
      username: "member",
      email: "member@gateway.com",
      password: "member123",
      level: "Member",
      status: "Active",
    },
  });
  console.log("Member seeded:", member.username);

  console.log("Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

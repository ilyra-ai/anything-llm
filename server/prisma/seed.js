const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const settings = [
    { label: "multi_user_mode", value: "false" },
    { label: "logo_filename", value: "anything-llm.png" },
  ];

  for (let setting of settings) {
    const existing = await prisma.system_settings.findUnique({
      where: { label: setting.label },
    });

    // Only create the setting if it doesn't already exist
    if (!existing) {
      await prisma.system_settings.create({
        data: setting,
      });
    }
  }

  const planExists = await prisma.plans.findFirst({ where: { name: "Free" } });
  if (!planExists) {
    await prisma.plans.create({ data: { name: "Free", price: 0 } });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

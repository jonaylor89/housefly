import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

async function main() {
  console.log(`Start seeding...`);

  // Clear existing data
  await prisma.listing.deleteMany();
  await prisma.destination.deleteMany();
  await prisma.search.deleteMany();
  await prisma.session.deleteMany();
  await prisma.user.deleteMany();

  // Create demo user
  const hashedPassword = await bcrypt.hash("password123", 10);

  const user = await prisma.user.create({
    data: {
      name: "Demo User",
      email: "demo@example.com",
      password: hashedPassword,
    },
  });

  console.log(`Created user: ${user.name}`);

  // Create destinations
  const destinations = [
    {
      name: "Paris, France",
      description:
        "The city of lights and romance, famous for the Eiffel Tower and cuisine.",
      imageUrl: "/images/city.jpg",
    },
    {
      name: "Bali, Indonesia",
      description:
        "A tropical paradise with beautiful beaches and rich cultural heritage.",
      imageUrl: "/images/beach.jpg",
    },
    {
      name: "Swiss Alps",
      description:
        "Stunning mountain views and world-class skiing destinations.",
      imageUrl: "/images/mountain.jpg",
    },
  ];

  for (const dest of destinations) {
    const destination = await prisma.destination.create({
      data: dest,
    });
    console.log(`Created destination: ${destination.name}`);

    // Create listings for each destination
    const listings = [
      {
        destinationId: destination.id,
        title: `Luxury Stay in ${destination.name}`,
        description: `Experience the best of ${destination.name} with this premium accommodation featuring stunning views and top amenities.`,
        price: 350,
        imageUrl: destination.imageUrl,
        amenities: JSON.stringify(["Wi-Fi", "Pool", "Spa", "Room service"]),
        isPremium: true,
      },
      {
        destinationId: destination.id,
        title: `Budget-Friendly Hotel in ${destination.name}`,
        description: `Affordable accommodation in a convenient location in ${destination.name}.`,
        price: 120,
        imageUrl: destination.imageUrl,
        amenities: JSON.stringify(["Wi-Fi", "Breakfast"]),
        isPremium: false,
      },
      {
        destinationId: destination.id,
        title: `Family Resort in ${destination.name}`,
        description: `Perfect for families visiting ${destination.name}, with activities for children and adults.`,
        price: 250,
        imageUrl: destination.imageUrl,
        amenities: JSON.stringify(["Wi-Fi", "Pool", "Parking", "Restaurant"]),
        isPremium: false,
      },
    ];

    for (const listing of listings) {
      await prisma.listing.create({
        data: listing,
      });
    }
    console.log(`Created listings for ${destination.name}`);
  }

  // Create sample saved searches for the demo user
  const savedSearches = [
    {
      userId: user.id,
      destination: "Paris, France",
      startDate: new Date("2023-12-15"),
      endDate: new Date("2023-12-22"),
      priceMin: 100,
      priceMax: 300,
      amenities: JSON.stringify(["Wi-Fi", "Breakfast"]),
    },
    {
      userId: user.id,
      destination: "Bali, Indonesia",
      startDate: new Date("2024-01-10"),
      endDate: new Date("2024-01-20"),
      priceMin: 150,
      priceMax: 400,
      amenities: JSON.stringify(["Pool", "Beach access"]),
    },
  ];

  for (const search of savedSearches) {
    await prisma.search.create({
      data: search,
    });
  }
  console.log(`Created saved searches for demo user`);

  console.log(`Seeding finished.`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

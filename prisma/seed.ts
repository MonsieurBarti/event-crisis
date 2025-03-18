import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";

const prisma = new PrismaClient();

async function main() {
	console.log("Seeding database...");

	// Clear existing data
	await prisma.unexpectedIssueOption.deleteMany();
	await prisma.unexpectedIssue.deleteMany();
	await prisma.catering.deleteMany();
	await prisma.entertainment.deleteMany();
	await prisma.constraint.deleteMany();
	await prisma.concept.deleteMany();
	await prisma.venue.deleteMany();
	await prisma.brief.deleteMany();
	await prisma.game.deleteMany();

	// Seed Briefs
	await prisma.brief.createMany({
		data: [
			{
				id: uuidv4(),
				name: "Corporate Anniversary",
				description:
					"A 25th anniversary celebration for a major tech company. They want something memorable and innovative.",
				budget: 50000,
			},
			{
				id: uuidv4(),
				name: "Product Launch",
				description:
					"A high-profile launch event for a revolutionary new consumer product. Needs to generate buzz and media attention.",
				budget: 75000,
			},
			{
				id: uuidv4(),
				name: "Charity Gala",
				description:
					"An annual fundraising gala for a well-known environmental charity. Needs to be elegant but environmentally conscious.",
				budget: 60000,
			},
		],
	});

	// Seed Venues
	await prisma.venue.createMany({
		data: [
			{
				id: uuidv4(),
				name: "Grand Ballroom",
				description:
					"A luxurious hotel ballroom with crystal chandeliers and marble floors. Can accommodate up to 500 guests.",
				cost: 15000,
			},
			{
				id: uuidv4(),
				name: "Urban Warehouse",
				description:
					"A trendy converted industrial space with exposed brick and high ceilings. Perfect for modern, edgy events.",
				cost: 8000,
			},
			{
				id: uuidv4(),
				name: "Botanical Gardens",
				description:
					"A beautiful outdoor venue with manicured gardens and a large glass conservatory. Excellent for day events.",
				cost: 12000,
			},
			{
				id: uuidv4(),
				name: "Skyline Rooftop",
				description:
					"A sleek rooftop venue with panoramic city views. Features indoor and outdoor spaces.",
				cost: 20000,
			},
		],
	});

	// Seed Concepts
	await prisma.concept.createMany({
		data: [
			{
				id: uuidv4(),
				name: "Future Tech Expo",
				description:
					"An interactive technology showcase with VR/AR experiences, robot demonstrations, and futuristic décor.",
				cost: 25000,
			},
			{
				id: uuidv4(),
				name: "Elegant Masquerade",
				description:
					"A sophisticated masked ball with ornate decorations, period costumes, and mysterious atmosphere.",
				cost: 18000,
			},
			{
				id: uuidv4(),
				name: "Sustainable Celebration",
				description:
					"An eco-friendly event with sustainable materials, farm-to-table catering, and natural decorations.",
				cost: 15000,
			},
			{
				id: uuidv4(),
				name: "Global Street Market",
				description:
					"A vibrant, multicultural experience with international food stalls, performers, and artisan markets.",
				cost: 22000,
			},
		],
	});

	// Seed Constraints
	await prisma.constraint.createMany({
		data: [
			{
				id: uuidv4(),
				name: "Accessibility Requirements",
				description: "Event must be fully accessible for guests with mobility issues.",
				impact: "moderate",
			},
			{
				id: uuidv4(),
				name: "Media Coverage",
				description:
					"Event will have media present and needs to accommodate camera crews and interviews.",
				impact: "significant",
			},
			{
				id: uuidv4(),
				name: "CEO Allergies",
				description: "The CEO has severe nut allergies and all food must be nut-free.",
				impact: "minor",
			},
			{
				id: uuidv4(),
				name: "Security Concerns",
				description:
					"High-profile guests require additional security measures and privacy.",
				impact: "major",
			},
		],
	});

	// Seed Entertainment
	await prisma.entertainment.createMany({
		data: [
			{
				id: uuidv4(),
				name: "Live Band",
				description:
					"A versatile 5-piece band that can play everything from jazz to current hits.",
				cost: 5000,
				impact: 8,
			},
			{
				id: uuidv4(),
				name: "Celebrity DJ",
				description:
					"A well-known DJ who can create the perfect atmosphere and keep guests dancing.",
				cost: 8000,
				impact: 9,
			},
			{
				id: uuidv4(),
				name: "Cirque Performers",
				description:
					"Acrobats, aerialists, and other circus performers providing roaming entertainment.",
				cost: 6500,
				impact: 10,
			},
			{
				id: uuidv4(),
				name: "Interactive Tech Games",
				description:
					"High-tech gaming stations and interactive digital experiences for guests.",
				cost: 4500,
				impact: 7,
			},
		],
	});

	// Seed Catering
	await prisma.catering.createMany({
		data: [
			{
				id: uuidv4(),
				name: "Gourmet Food Stations",
				description:
					"Multiple chef-attended stations offering a variety of cuisines and dishes.",
				cost: 12000,
				guestSatisfaction: 9,
			},
			{
				id: uuidv4(),
				name: "Plated Fine Dining",
				description:
					"Elegant three-course meal with premium ingredients and wine pairings.",
				cost: 18000,
				guestSatisfaction: 10,
			},
			{
				id: uuidv4(),
				name: "International Buffet",
				description: "Self-service buffet featuring dishes from around the world.",
				cost: 10000,
				guestSatisfaction: 7,
			},
			{
				id: uuidv4(),
				name: "Trendy Food Trucks",
				description: "A selection of popular food trucks offering casual, trendy bites.",
				cost: 8000,
				guestSatisfaction: 8,
			},
		],
	});

	// Seed Unexpected Issues
	await prisma.unexpectedIssue.createMany({
		data: [
			{
				id: uuidv4(),
				name: "Weather Emergency",
				description: "A sudden severe weather warning has been issued for your event date.",
			},
			{
				id: uuidv4(),
				name: "Vendor Cancellation",
				description: "A key vendor has unexpectedly canceled at the last minute.",
			},
			{
				id: uuidv4(),
				name: "Budget Cut",
				description:
					"The client has just informed you that the budget needs to be reduced by 20%.",
			},
			{
				id: uuidv4(),
				name: "Celebrity Appearance",
				description: "A VIP has decided to attend, requiring last-minute accommodations.",
			},
			{
				id: uuidv4(),
				name: "Technical Failure",
				description:
					"Major audiovisual equipment is malfunctioning just hours before the event.",
			},
		],
	});

	// Get the created issues to add options
	const createdIssues = await prisma.unexpectedIssue.findMany();

	// Seed Unexpected Issue Options
	for (const issue of createdIssues) {
		if (issue.name === "Weather Emergency") {
			await prisma.unexpectedIssueOption.createMany({
				data: [
					{
						id: uuidv4(),
						unexpectedIssueId: issue.id,
						name: "Move Indoors",
						description: "Quickly reorganize the event to move to an indoor venue.",
						budgetImpact: -5000,
					},
					{
						id: uuidv4(),
						unexpectedIssueId: issue.id,
						name: "Provide Weather Protection",
						description: "Rent tents, umbrellas, and heating/cooling equipment.",
						budgetImpact: -3000,
					},
					{
						id: uuidv4(),
						unexpectedIssueId: issue.id,
						name: "Reschedule",
						description: "Postpone the event to another date.",
						budgetImpact: -8000,
					},
				],
			});
		} else if (issue.name === "Vendor Cancellation") {
			await prisma.unexpectedIssueOption.createMany({
				data: [
					{
						id: uuidv4(),
						unexpectedIssueId: issue.id,
						name: "Premium Replacement",
						description: "Hire a premium vendor at rush rates.",
						budgetImpact: -4000,
					},
					{
						id: uuidv4(),
						unexpectedIssueId: issue.id,
						name: "Modify Plans",
						description: "Adjust the event to work without this vendor.",
						budgetImpact: -1000,
					},
					{
						id: uuidv4(),
						unexpectedIssueId: issue.id,
						name: "DIY Solution",
						description: "Have your team handle the responsibilities in-house.",
						budgetImpact: -2000,
					},
				],
			});
		} else if (issue.name === "Budget Cut") {
			await prisma.unexpectedIssueOption.createMany({
				data: [
					{
						id: uuidv4(),
						unexpectedIssueId: issue.id,
						name: "Downsize Event",
						description: "Reduce the scale and scope of the entire event.",
						budgetImpact: -1000,
					},
					{
						id: uuidv4(),
						unexpectedIssueId: issue.id,
						name: "Cut Specific Elements",
						description: "Eliminate certain features but maintain the core experience.",
						budgetImpact: -2000,
					},
					{
						id: uuidv4(),
						unexpectedIssueId: issue.id,
						name: "Find Sponsors",
						description: "Quickly secure sponsors to cover the budget gap.",
						budgetImpact: 0,
					},
				],
			});
		} else if (issue.name === "Celebrity Appearance") {
			await prisma.unexpectedIssueOption.createMany({
				data: [
					{
						id: uuidv4(),
						unexpectedIssueId: issue.id,
						name: "VIP Treatment",
						description: "Provide full VIP experience with security and amenities.",
						budgetImpact: -6000,
					},
					{
						id: uuidv4(),
						unexpectedIssueId: issue.id,
						name: "Basic Accommodation",
						description: "Make reasonable adjustments without extravagance.",
						budgetImpact: -2000,
					},
					{
						id: uuidv4(),
						unexpectedIssueId: issue.id,
						name: "Leverage for Publicity",
						description: "Use the appearance for event promotion and visibility.",
						budgetImpact: 1000,
					},
				],
			});
		} else if (issue.name === "Technical Failure") {
			await prisma.unexpectedIssueOption.createMany({
				data: [
					{
						id: uuidv4(),
						unexpectedIssueId: issue.id,
						name: "Emergency Rental",
						description: "Rent replacement equipment at premium rates.",
						budgetImpact: -4000,
					},
					{
						id: uuidv4(),
						unexpectedIssueId: issue.id,
						name: "Backup Systems",
						description: "Switch to simpler backup equipment you already have.",
						budgetImpact: -1000,
					},
					{
						id: uuidv4(),
						unexpectedIssueId: issue.id,
						name: "Redesign Program",
						description: "Modify the event to require less technical elements.",
						budgetImpact: -2000,
					},
				],
			});
		}
	}

	console.log("Database seeded successfully!");
}

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});

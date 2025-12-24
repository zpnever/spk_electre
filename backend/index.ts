import express, { Request, Response } from "express";
import { prisma } from "./lib/prisma";
import cors from "cors";
const app = express();
const PORT = 4001;

// Middleware supaya bisa baca JSON
app.use(express.json());
app.use(cors());
// GET
app.get("/api/template", async (req: Request, res: Response) => {
	try {
		const templates = await prisma.template.findMany({
			include: {
				kriteria: true,
			},
		});

		const payload = templates.map((x) => {
			return {
				id: x.id,
				name: x.name,
				description: x.description,
				creator: x.creator,
				kriteria: x.kriteria.map((k) => {
					return {
						name: k.name,
						weight: k.weight,
						isNegative: k.isNegative,
					};
				}),
			};
		});

		res.status(200).json({
			message: "All Templates",
			data: payload,
		});
	} catch (error) {
		res.status(500).json({ message: "Internal Server Error" });
	}
});

app.get("/api/template/:id", async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const templates = await prisma.template.findUnique({
			where: {
				id,
			},
			include: {
				kriteria: true,
			},
		});

		res.status(200).json({
			message: "Template by id",
			data: templates,
		});
	} catch (error) {
		res.status(500).json({ message: "Internal Server Error" });
	}
});

// POST
app.post("/api/template", async (req: Request, res: Response) => {
	try {
		const { name, kriteria, creator, description } = req.body;

		if (
			!name ||
			!kriteria ||
			kriteria.length <= 0 ||
			!creator ||
			!description
		) {
			return res.status(400).json({
				message: "Field is required",
			});
		}

		const newTemplate = await prisma.template.create({
			data: {
				name,
				description,
				creator,
				kriteria: {
					create: kriteria,
				},
			},
		});

		res.status(201).json({
			message: "Template created",
			data: newTemplate,
		});
	} catch (error) {
		res.status(500).json({ message: "Internal Server Error" });
	}
});

// Start server
app.listen(PORT, () => {
	console.log(`Server running at http://localhost:${PORT}`);
});

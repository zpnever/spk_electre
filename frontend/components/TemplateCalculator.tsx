/* eslint-disable */

"use client";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardDescription,
	CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
	DialogFooter,
} from "@/components/ui/dialog";
import {
	LayoutTemplate,
	Plus,
	User,
	Calendar,
	Trash2,
	ArrowRight,
	Search,
	ClipboardList,
} from "lucide-react";
import Link from "next/link";

const TemplateCalculator = () => {
	const [template, setTemplate] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);
	const [openCreateTemplate, setOpenCreateTemplate] = useState(false);
	const [searchTerm, setSearchTerm] = useState("");

	// State untuk form template baru
	const [createTemplate, setCreateTemplate] = useState({
		name: "",
		description: "",
		creator: "",
		kriteria: [{ name: "", weight: 1, isNegative: false }],
	});

	useEffect(() => {
		getTemplate();
	}, []);

	const getTemplate = async () => {
		try {
			//
			setLoading(true);
			const res = await fetch(
				"http://103.103.22.103:4001/api-backend/template"
			);
			const json = await res.json();
			if (!res.ok) throw new Error(json.message);
			setTemplate(json.data);
		} catch (err: any) {
			toast.error(err.message || "Gagal memuat template");
		} finally {
			setLoading(false);
		}
	};

	const handleCreateTemplate = async () => {
		if (!createTemplate.name || !createTemplate.creator) {
			return toast.error("Nama template dan pembuat wajib diisi");
		}

		try {
			const res = await fetch(
				"http://103.103.22.103:4001/api-backend/template",
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(createTemplate),
				}
			);
			const json = await res.json();

			if (!res.ok) throw new Error(json.message);

			setTemplate((prev) => [...prev, json.data]);

			toast.success("Template berhasil dibuat!");
			setOpenCreateTemplate(false);
			setCreateTemplate({
				name: "",
				description: "",
				creator: "",
				kriteria: [{ name: "", weight: 1, isNegative: false }],
			});
		} catch (err: any) {
			toast.error("Gagal membuat template");
		}
	};

	const addKriteriaRow = () => {
		setCreateTemplate({
			...createTemplate,
			kriteria: [
				...createTemplate.kriteria,
				{ name: "", weight: 1, isNegative: false },
			],
		});
	};

	const filteredTemplates = template.filter(
		(t) =>
			t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			t.creator.toLowerCase().includes(searchTerm.toLowerCase())
	);

	return (
		<div className="max-w-7xl mx-auto py-12 px-6 space-y-8 antialiased">
			{/* Header Section */}
			<div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-8">
				<div>
					<h1 className="text-3xl font-extrabold tracking-tight text-slate-900 flex items-center gap-2">
						<LayoutTemplate className="text-primary" /> Template Kriteria
					</h1>
					<p className="text-muted-foreground mt-1">
						Gunakan template yang sudah ada untuk mempercepat proses input data
						ELECTRE Anda.
					</p>
				</div>

				<Dialog open={openCreateTemplate} onOpenChange={setOpenCreateTemplate}>
					<DialogTrigger asChild>
						<Button className="shadow-lg shadow-primary/20">
							<Plus className="w-4 h-4 mr-2" /> Buat Template Baru
						</Button>
					</DialogTrigger>
					<DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
						<DialogHeader>
							<DialogTitle>Buat Template Baru</DialogTitle>
						</DialogHeader>
						<div className="space-y-4 py-4">
							<div className="grid grid-cols-2 gap-4">
								<div className="space-y-2">
									<label className="text-xs font-bold uppercase text-slate-500">
										Nama Template
									</label>
									<Input
										placeholder="Contoh: Pemilihan Laptop"
										value={createTemplate.name}
										onChange={(e) =>
											setCreateTemplate({
												...createTemplate,
												name: e.target.value,
											})
										}
									/>
								</div>
								<div className="space-y-2">
									<label className="text-xs font-bold uppercase text-slate-500">
										Nama Pembuat
									</label>
									<Input
										placeholder="Nama Anda"
										value={createTemplate.creator}
										onChange={(e) =>
											setCreateTemplate({
												...createTemplate,
												creator: e.target.value,
											})
										}
									/>
								</div>
							</div>
							<div className="space-y-2">
								<label className="text-xs font-bold uppercase text-slate-500">
									Deskripsi Singkat
								</label>
								<Input
									placeholder="Gunakan template ini untuk..."
									value={createTemplate.description}
									onChange={(e) =>
										setCreateTemplate({
											...createTemplate,
											description: e.target.value,
										})
									}
								/>
							</div>

							<div className="border-t pt-4">
								<div className="flex justify-between items-center mb-4">
									<h4 className="font-bold text-sm flex items-center gap-2">
										<ClipboardList size={16} /> Daftar Kriteria
									</h4>
									<Button variant="outline" size="sm" onClick={addKriteriaRow}>
										<Plus size={14} className="mr-1" /> Tambah Kriteria
									</Button>
								</div>

								<div className="space-y-3">
									{createTemplate.kriteria.map((k, idx) => (
										<div key={idx} className="flex gap-2 items-center">
											<Input
												placeholder="Nama Kriteria"
												className="flex-1"
												value={k.name}
												onChange={(e) => {
													const newK = [...createTemplate.kriteria];
													newK[idx].name = e.target.value;
													setCreateTemplate({
														...createTemplate,
														kriteria: newK,
													});
												}}
											/>
											<Input
												type="number"
												placeholder="W"
												className="w-20"
												value={k.weight}
												onChange={(e) => {
													const newK = [...createTemplate.kriteria];
													newK[idx].weight = Number(e.target.value);
													setCreateTemplate({
														...createTemplate,
														kriteria: newK,
													});
												}}
											/>
											<Button
												variant={k.isNegative ? "destructive" : "secondary"}
												size="sm"
												onClick={() => {
													const newK = [...createTemplate.kriteria];
													newK[idx].isNegative = !newK[idx].isNegative;
													setCreateTemplate({
														...createTemplate,
														kriteria: newK,
													});
												}}
											>
												{k.isNegative ? "Cost" : "Benefit"}
											</Button>
										</div>
									))}
								</div>
							</div>
						</div>
						<DialogFooter>
							<Button
								variant="ghost"
								onClick={() => setOpenCreateTemplate(false)}
							>
								Batal
							</Button>
							<Button onClick={handleCreateTemplate}>Simpan Template</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>
			</div>

			{/* Search Bar */}
			<div className="relative max-w-md">
				<Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
				<Input
					className="pl-10"
					placeholder="Cari template atau pembuat..."
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
				/>
			</div>

			{/* Template Grid */}
			{loading ? (
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
					{[1, 2, 3].map((i) => (
						<div
							key={i}
							className="h-48 bg-slate-100 animate-pulse rounded-2xl"
						/>
					))}
				</div>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{filteredTemplates.map((t, idx) => (
						<Card
							key={idx}
							className="group hover:border-primary/50 transition-all shadow-sm flex flex-col"
						>
							<CardHeader>
								<div className="flex justify-between items-start mb-2">
									<Badge variant="outline" className="text-[10px] font-bold">
										{t.kriteria.length} KRITERIA
									</Badge>
									<span className="text-[10px] text-slate-400 flex items-center gap-1">
										<Calendar size={10} />{" "}
										{new Date(t.createdAt).toLocaleDateString()}
									</span>
								</div>
								<CardTitle className="text-xl group-hover:text-primary transition-colors">
									{t.name}
								</CardTitle>
								<CardDescription className="line-clamp-2">
									{t.description || "Tidak ada deskripsi."}
								</CardDescription>
							</CardHeader>
							<CardContent className="flex-1">
								<div className="flex flex-wrap gap-1.5">
									{t.kriteria.slice(0, 3).map((k: any, kIdx: number) => (
										<Badge
											key={kIdx}
											variant="secondary"
											className="text-[9px] bg-slate-100"
										>
											{k.name}
										</Badge>
									))}
									{t.kriteria.length > 3 && (
										<span className="text-[9px] text-slate-400">
											+{t.kriteria.length - 3} lainnya
										</span>
									)}
								</div>
							</CardContent>
							<CardFooter className="border-t bg-slate-50/50 py-4 flex justify-between items-center">
								<div className="flex items-center gap-2 text-xs text-slate-500">
									<User size={14} /> {t.creator}
								</div>
								<Link
									href={`/calculator/${t.id}`}
									className="text-primary font-bold hover:bg-primary hover:text-white transition-all flex"
								>
									Gunakan <ArrowRight size={14} className="ml-1" />
								</Link>
							</CardFooter>
						</Card>
					))}
				</div>
			)}
		</div>
	);
};

export default TemplateCalculator;

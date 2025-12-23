"use client";
/* eslint-disable */
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardDescription,
} from "@/components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
	Trash2,
	Plus,
	Calculator as CalcIcon,
	Info,
	ArrowDownCircle,
	ArrowUpCircle,
	Trophy,
	CheckCircle2,
	ChevronRight,
} from "lucide-react";

interface Criterion {
	name: string;
	weight: number;
	isNegative: boolean;
}

const Calculator = () => {
	// --- State ---
	const [choices, setChoices] = useState<string[]>([
		"Alternatif A",
		"Alternatif B",
		"Alternatif C",
	]);
	const [criteria, setCriteria] = useState<Criterion[]>([
		{ name: "Harga", weight: 5, isNegative: true },
		{ name: "Kualitas", weight: 4, isNegative: false },
		{ name: "Fitur", weight: 3, isNegative: false },
	]);
	const [values, setValues] = useState<Record<string, number>>({});
	const [results, setResults] = useState<any>(null);

	// --- Handlers ---
	const addChoice = () =>
		setChoices([...choices, `Alternatif ${choices.length + 1}`]);
	const deleteChoice = (index: number) =>
		setChoices(choices.filter((_, i) => i !== index));

	const addCriteria = () =>
		setCriteria([
			...criteria,
			{ name: `Kriteria ${criteria.length + 1}`, weight: 1, isNegative: false },
		]);
	const deleteCriteria = (index: number) =>
		setCriteria(criteria.filter((_, i) => i !== index));

	const updateValue = (cIdx: number, crIdx: number, val: string) => {
		setValues({ ...values, [`${cIdx}-${crIdx}`]: parseFloat(val) || 0 });
	};

	// --- Logika ELECTRE ---
	const calculateELECTRE = () => {
		const n = choices.length;
		const m = criteria.length;

		if (n < 2)
			return alert("Tambahkan minimal 2 alternatif untuk dibandingkan.");

		// Matriks Keputusan X
		const X: number[][] = choices.map((_, i) =>
			criteria.map((_, j) => values[`${i}-${j}`] || 0)
		);

		console.log({ X });
		// 1. Normalisasi (R)
		const R: number[][] = Array.from({ length: n }, () => Array(m).fill(0));
		for (let j = 0; j < m; j++) {
			const sumSq = Math.sqrt(
				X.reduce((acc, row) => acc + Math.pow(row[j], 2), 0)
			);
			for (let i = 0; i < n; i++) R[i][j] = X[i][j] / (sumSq || 1);
		}
		console.log({ R });
		// 2. Normalisasi Terbobot (V)
		const V = R.map((row) => row.map((val, j) => val * criteria[j].weight));
		console.log({ V });
		// 3. Matriks Concordance (C) & Discordance (D)
		const totalWeight = criteria.reduce((acc, c) => acc + c.weight, 0);
		const C: number[][] = Array.from({ length: n }, () => Array(n).fill(0));
		const D: number[][] = Array.from({ length: n }, () => Array(n).fill(0));
		console.log({ C });
		console.log({ D });
		for (let i = 0; i < n; i++) {
			for (let k = 0; k < n; k++) {
				if (i === k) continue;
				let cSet: number[] = [],
					dSet: number[] = [];

				for (let j = 0; j < m; j++) {
					const isBetter = criteria[j].isNegative
						? V[i][j] <= V[k][j]
						: V[i][j] >= V[k][j];
					if (isBetter) cSet.push(j);
					else dSet.push(j);
				}

				// PERBAIKAN: Concordance dibagi total bobot
				C[i][k] =
					cSet.reduce((acc, j) => acc + criteria[j].weight, 0) / totalWeight;

				if (dSet.length > 0) {
					const diffs = dSet.map((j) => Math.abs(V[i][j] - V[k][j]));
					const allDiffs = Array.from({ length: m }, (_, j) =>
						Math.abs(V[i][j] - V[k][j])
					);
					const maxDiffAll = Math.max(...allDiffs);
					D[i][k] = Math.max(...diffs) / (maxDiffAll || 1);
				}
			}
		}
		console.log({ C });
		console.log({ D });

		// 4. Thresholds
		const totalComparisons = n * (n - 1);
		const cThreshold = C.flat().reduce((a, b) => a + b, 0) / totalComparisons;
		const dThreshold = D.flat().reduce((a, b) => a + b, 0) / totalComparisons;
		console.log({ cThreshold });
		console.log({ dThreshold });
		// 5. Matriks F (Concordance Dominance)
		const F = C.map((row, i) =>
			row.map((val, j) => {
				if (i === j) return 0;
				return val >= cThreshold ? 1 : 0;
			})
		);

		console.log({ F });

		// 6. Matriks G (Discordance Dominance)
		const G = D.map((row, i) =>
			row.map((val, j) => {
				if (i === j) return 0;
				return val <= dThreshold ? 1 : 0;
			})
		);

		console.log({ G });

		// 7. Matriks E (Aggregate Dominance) = F ∩ G
		const E: number[][] = F.map((row, i) =>
			row.map((val, j) => {
				if (i === j) return 0;
				return F[i][j] === 1 && G[i][j] === 1 ? 1 : 0;
			})
		);

		console.log({ E });

		// 8. Final Ranking
		const ranking = choices
			.map((name, i) => ({
				name,
				score: E[i].reduce((a, b) => a + b, 0) as number,
			}))
			.sort((a, b) => b.score - a.score);

		setResults({ C, D, cThreshold, dThreshold, F, G, E, ranking, X, R, V });
	};

	return (
		<div className="max-w-4xl mx-auto py-12 px-6 space-y-8 antialiased">
			<div className="space-y-2 border-b pb-6">
				<h1 className="text-3xl font-extrabold tracking-tight">
					SPK Metode ELECTRE
				</h1>
				<p className="text-muted-foreground text-lg">
					Gunakan kriteria dan bobot untuk menentukan pilihan terbaik secara
					objektif.
				</p>
			</div>

			{/* 1. SECTION KRITERIA */}
			<Card className="shadow-sm border-slate-200">
				<CardHeader className="flex flex-row items-center justify-between space-y-0">
					<div>
						<CardTitle>1. Kriteria & Bobot</CardTitle>
						<CardDescription>
							Atur parameter penilaian dan sifat kriteria.
						</CardDescription>
					</div>
					<Button onClick={addCriteria} variant="outline" size="sm">
						<Plus className="w-4 h-4 mr-2" /> Tambah
					</Button>
				</CardHeader>
				<CardContent className="space-y-4">
					{criteria.map((c, i) => (
						<div
							key={i}
							className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end bg-slate-50/50 p-4 rounded-xl border border-slate-100"
						>
							<div className="md:col-span-5">
								<label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5 block">
									Nama Kriteria
								</label>
								<Input
									className="bg-white"
									value={c.name}
									onChange={(e) => {
										const nc = [...criteria];
										nc[i].name = e.target.value;
										setCriteria(nc);
									}}
								/>
							</div>
							<div className="md:col-span-2">
								<label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5 block">
									Bobot
								</label>
								<Input
									type="number"
									className="bg-white text-center font-bold"
									value={c.weight}
									onChange={(e) => {
										const nc = [...criteria];
										nc[i].weight = parseInt(e.target.value) || 0;
										setCriteria(nc);
									}}
								/>
							</div>
							<div className="md:col-span-4">
								<label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5 block">
									Sifat (Benefit vs Cost)
								</label>
								<div className="grid grid-cols-2 gap-1 bg-white p-1 rounded-md border border-slate-200">
									<Button
										variant={c.isNegative ? "secondary" : "ghost"}
										className={`h-8 text-[10px] uppercase font-bold ${
											c.isNegative ? "bg-slate-200 shadow-sm" : ""
										}`}
										onClick={() => {
											const nc = [...criteria];
											nc[i].isNegative = true;
											setCriteria(nc);
										}}
									>
										<ArrowDownCircle className="w-3 h-3 mr-1" /> Cost
									</Button>
									<Button
										variant={!c.isNegative ? "secondary" : "ghost"}
										className={`h-8 text-[10px] uppercase font-bold ${
											!c.isNegative ? "bg-slate-200 shadow-sm" : ""
										}`}
										onClick={() => {
											const nc = [...criteria];
											nc[i].isNegative = false;
											setCriteria(nc);
										}}
									>
										<ArrowUpCircle className="w-3 h-3 mr-1" /> Benefit
									</Button>
								</div>
							</div>
							<div className="md:col-span-1 flex justify-end">
								<Button
									variant="ghost"
									size="icon"
									className="text-slate-400 hover:text-destructive"
									onClick={() => deleteCriteria(i)}
								>
									<Trash2 className="w-4 h-4" />
								</Button>
							</div>
						</div>
					))}
					<div className="text-[11px] text-slate-400 flex items-center gap-2 px-1 italic">
						<Info size={14} /> Kriteria "Cost" berarti nilai rendah lebih baik
						(Harga, Jarak, dsb).
					</div>
				</CardContent>
			</Card>

			{/* 2. SECTION ALTERNATIF */}
			<Card className="shadow-sm border-slate-200">
				<CardHeader className="flex flex-row items-center justify-between space-y-0">
					<div>
						<CardTitle>2. Daftar Alternatif</CardTitle>
						<CardDescription>
							Masukkan nama objek atau kandidat yang akan dinilai.
						</CardDescription>
					</div>
					<Button onClick={addChoice} variant="outline" size="sm">
						<Plus className="w-4 h-4 mr-2" /> Tambah
					</Button>
				</CardHeader>
				<CardContent className="space-y-3">
					{choices.map((name, i) => (
						<div key={i} className="flex gap-3 items-center group">
							<Badge variant="secondary" className="h-10 px-3 font-mono">
								{(i + 1).toString().padStart(2, "0")}
							</Badge>
							<Input
								className="flex-1"
								value={name}
								onChange={(e) => {
									const nch = [...choices];
									nch[i] = e.target.value;
									setChoices(nch);
								}}
							/>
							<Button
								variant="ghost"
								size="icon"
								onClick={() => deleteChoice(i)}
								className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-destructive"
							>
								<Trash2 className="w-4 h-4" />
							</Button>
						</div>
					))}
				</CardContent>
			</Card>

			{/* 3. MATRIKS KEPUTUSAN */}
			<Card className="shadow-sm border-slate-200 overflow-hidden">
				<CardHeader>
					<CardTitle>3. Matriks Keputusan</CardTitle>
					<CardDescription>
						Berikan penilaian angka untuk setiap kriteria pada alternatif.
					</CardDescription>
				</CardHeader>
				<div className="overflow-x-auto">
					<Table>
						<TableHeader className="bg-slate-50/50">
							<TableRow>
								<TableHead className="w-[180px] font-bold">
									Alternatif \ Kriteria
								</TableHead>
								{criteria.map((c, i) => (
									<TableHead
										key={i}
										className="text-center font-bold text-slate-900"
									>
										{c.name}
									</TableHead>
								))}
							</TableRow>
						</TableHeader>
						<TableBody>
							{choices.map((alt, i) => (
								<TableRow key={i}>
									<TableCell className="font-semibold text-slate-600 bg-slate-50/30">
										{alt}
									</TableCell>
									{criteria.map((_, j) => (
										<TableCell key={j} className="p-0 border-r last:border-r-0">
											<input
												type="number"
												className="w-full h-12 text-center bg-transparent focus:bg-white focus:ring-2 focus:ring-blue-500/20 outline-none transition-all font-medium"
												onChange={(e) => updateValue(i, j, e.target.value)}
												placeholder="0"
											/>
										</TableCell>
									))}
								</TableRow>
							))}
						</TableBody>
					</Table>
				</div>
				<CardContent className="p-6 bg-slate-50/50 border-t">
					<Button
						onClick={calculateELECTRE}
						className="w-full h-12 text-lg font-bold shadow-md"
					>
						<CalcIcon className="w-5 h-5 mr-2" /> Hitung Rekomendasi
					</Button>
				</CardContent>
			</Card>

			{/* 4. HASIL AKHIR */}
			{results && (
				<div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<Card className="border-none bg-slate-100 shadow-inner">
							<CardContent className="pt-6">
								<div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
									Concordance Threshold
								</div>
								<div className="text-3xl font-black text-slate-800">
									{results.cThreshold.toFixed(4)}
								</div>
							</CardContent>
						</Card>
						<Card className="border-none bg-slate-100 shadow-inner">
							<CardContent className="pt-6">
								<div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
									Discordance Threshold
								</div>
								<div className="text-3xl font-black text-slate-800">
									{results.dThreshold.toFixed(4)}
								</div>
							</CardContent>
						</Card>
					</div>

					<Card className="border-2 border-slate-900 overflow-hidden shadow-xl">
						<CardHeader className="bg-slate-900 text-white">
							<div className="flex items-center gap-2">
								<Trophy className="text-yellow-400" />
								<CardTitle>Hasil Akhir & Ranking</CardTitle>
							</div>
						</CardHeader>
						<CardContent className="p-0">
							<div className="divide-y divide-slate-100">
								{results.ranking.map((rank: any, i: number) => (
									<div
										key={i}
										className="flex items-center justify-between p-5 hover:bg-slate-50 transition-colors"
									>
										<div className="flex items-center gap-4">
											<div
												className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-lg ${
													i === 0
														? "bg-yellow-400 text-slate-900 ring-4 ring-yellow-100"
														: "bg-slate-100 text-slate-500"
												}`}
											>
												{i + 1}
											</div>
											<div>
												<div className="font-bold text-lg">{rank.name}</div>
												<div className="text-xs text-slate-400 uppercase font-bold tracking-tight">
													Skor Dominansi: {rank.score}
												</div>
											</div>
										</div>
										{i === 0 && (
											<Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-green-200 py-1 px-3">
												<CheckCircle2 className="w-3 h-3 mr-1" /> Rekomendasi
												Utama
											</Badge>
										)}
									</div>
								))}
							</div>
						</CardContent>
					</Card>

					<Card className="border-slate-200 opacity-60 grayscale hover:grayscale-0 transition-all">
						<CardHeader>
							<CardTitle className="text-sm uppercase tracking-widest font-bold text-slate-500">
								Aggregate Dominance Matrix (E)
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="space-y-2">
								{results.E.map((row: any, i: number) => (
									<div key={i} className="flex gap-2">
										{row.map((val: number, j: number) => (
											<div
												key={j}
												className={`flex-1 h-12 flex items-center justify-center rounded-md border text-sm font-bold ${
													val === 1
														? "bg-slate-900 text-white border-slate-900"
														: "bg-white text-slate-200 border-slate-100"
												}`}
											>
												{i === j ? "×" : val}
											</div>
										))}
									</div>
								))}
							</div>
						</CardContent>
					</Card>
				</div>
			)}
		</div>
	);
};

export default Calculator;

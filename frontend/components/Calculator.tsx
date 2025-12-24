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
		// Normalisasi (R)
		const R: number[][] = Array.from({ length: n }, () => Array(m).fill(0));
		for (let j = 0; j < m; j++) {
			const sumSq = Math.sqrt(
				X.reduce((acc, row) => acc + Math.pow(row[j], 2), 0)
			);
			for (let i = 0; i < n; i++) R[i][j] = X[i][j] / (sumSq || 1);
		}
		console.log({ R });
		// Normalisasi Terbobot (V)
		const V = R.map((row) => row.map((val, j) => val * criteria[j].weight));
		console.log({ V });
		// Matriks Concordance (C) & Discordance (D)
		const totalWeight = criteria.reduce((acc, c) => acc + c.weight, 0);
		const C: number[][] = Array.from({ length: n }, () => Array(n).fill(0));
		const D: number[][] = Array.from({ length: n }, () => Array(n).fill(0));

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

		// Thresholds
		const totalComparisons = n * (n - 1);
		const cThreshold = C.flat().reduce((a, b) => a + b, 0) / totalComparisons;
		const dThreshold = D.flat().reduce((a, b) => a + b, 0) / totalComparisons;
		console.log({ cThreshold });
		console.log({ dThreshold });
		// Matriks F (Concordance Dominance)
		const F = C.map((row, i) =>
			row.map((val, j) => {
				if (i === j) return 0;
				return val >= cThreshold ? 1 : 0;
			})
		);

		console.log({ F });

		// Matriks G (Discordance Dominance)
		const G = D.map((row, i) =>
			row.map((val, j) => {
				if (i === j) return 0;
				return val <= dThreshold ? 1 : 0;
			})
		);

		console.log({ G });

		// Matriks E (Aggregate Dominance) = F ∩ G
		const E: number[][] = F.map((row, i) =>
			row.map((val, j) => {
				if (i === j) return 0;
				return F[i][j] === 1 && G[i][j] === 1 ? 1 : 0;
			})
		);

		console.log({ E });

		// Final Ranking
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
				<h1 className="text-3xl font-extrabold tracking-tight text-center">
					ELECTRE Calculator
				</h1>
				<p className="text-muted-foreground text-lg text-center">
					Gunakan kriteria dan bobot untuk menentukan pilihan terbaik secara
					objektif.
				</p>
			</div>

			{/* SECTION KRITERIA */}
			<Card className="shadow-sm border-slate-200">
				<CardHeader className="flex flex-row items-center justify-between space-y-0">
					<div>
						<CardTitle>Kriteria & Bobot</CardTitle>
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

			{/* SECTION ALTERNATIF */}
			<Card className="shadow-sm border-slate-200">
				<CardHeader className="flex flex-row items-center justify-between space-y-0">
					<div>
						<CardTitle>Daftar Alternatif</CardTitle>
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

			{/* MATRIKS KEPUTUSAN */}
			<Card className="shadow-sm border-slate-200 overflow-hidden">
				<CardHeader>
					<CardTitle>Matriks Keputusan</CardTitle>
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

			{/* HASIL AKHIR */}
			{results && (
				<div className="space-y-10 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
					{/* RANKING TERATAS */}
					<Card className="border-primary/20 bg-primary/5 shadow-lg overflow-hidden">
						<CardHeader className="bg-primary/10 border-b border-primary/10">
							<div className="flex items-center gap-2">
								<Trophy className="w-6 h-6 text-yellow-600" />
								<CardTitle>Hasil Rekomendasi Akhir</CardTitle>
							</div>
							<CardDescription className="text-primary/70">
								Urutan alternatif berdasarkan nilai Aggregate Dominance (Matriks
								E).
							</CardDescription>
						</CardHeader>
						<CardContent className="p-0">
							<div className="divide-y divide-primary/10">
								{results.ranking.map((item: any, idx: number) => (
									<div
										key={idx}
										className="flex items-center justify-between p-4 hover:bg-primary/5 transition-colors"
									>
										<div className="flex items-center gap-4">
											<div
												className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
													idx === 0
														? "bg-yellow-500 text-white"
														: "bg-slate-200 text-slate-600"
												}`}
											>
												{idx + 1}
											</div>
											<span className="font-semibold text-lg">{item.name}</span>
										</div>
										<div className="flex items-center gap-4">
											<Badge
												variant={idx === 0 ? "default" : "secondary"}
												className="px-4 py-1"
											>
												Skor: {item.score}
											</Badge>
											{idx === 0 && (
												<CheckCircle2 className="text-green-600 w-6 h-6" />
											)}
										</div>
									</div>
								))}
							</div>
						</CardContent>
					</Card>

					<div className="space-y-6">
						<h2 className="text-2xl font-bold flex items-center gap-2">
							<ChevronRight className="text-primary" /> Detail Proses
							Perhitungan
						</h2>

						{/* MATRIKS AWAL & NORMALISASI */}
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<MatrixDisplay
								title="Matriks Keputusan (X)"
								data={results.X}
								criteria={criteria}
								choices={choices}
							/>
							<MatrixDisplay
								title="Matriks Normalisasi (R)"
								data={results.R}
								criteria={criteria}
								choices={choices}
								isFloat
							/>
						</div>

						{/* TERBOBOT & CONCORDANCE/DISCORDANCE */}
						<MatrixDisplay
							title="Matriks Normalisasi Terbobot (V)"
							data={results.V}
							criteria={criteria}
							choices={choices}
							isFloat
						/>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<div>
								<MatrixDisplay
									title="Matriks Concordance (C)"
									data={results.C}
									choices={choices}
									isSquare
									isFloat
								/>
								<div className="mt-2 p-3 bg-blue-50 border border-blue-100 rounded-lg text-sm flex justify-between">
									<span className="font-medium">
										Threshold Concordance (c):
									</span>
									<span className="font-bold text-blue-700">
										{results.cThreshold.toFixed(4)}
									</span>
								</div>
							</div>
							<div>
								<MatrixDisplay
									title="Matriks Discordance (D)"
									data={results.D}
									choices={choices}
									isSquare
									isFloat
								/>
								<div className="mt-2 p-3 bg-orange-50 border border-orange-100 rounded-lg text-sm flex justify-between">
									<span className="font-medium">
										Threshold Discordance (d):
									</span>
									<span className="font-bold text-orange-700">
										{results.dThreshold.toFixed(4)}
									</span>
								</div>
							</div>
						</div>

						{/* DOMINANCE MATRICES */}
						<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
							<MatrixDisplay
								title="Concordance Dominance (F)"
								data={results.F}
								choices={choices}
								isSquare
								isBinary
							/>
							<MatrixDisplay
								title="Discordance Dominance (G)"
								data={results.G}
								choices={choices}
								isSquare
								isBinary
							/>
							<MatrixDisplay
								title="Aggregate Dominance (E)"
								data={results.E}
								choices={choices}
								isSquare
								isBinary
								highlight
							/>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

const MatrixDisplay = ({
	title,
	data,
	criteria,
	choices,
	isFloat,
	isSquare,
	isBinary,
	highlight,
}: any) => (
	<Card
		className={`shadow-sm overflow-hidden ${
			highlight ? "border-primary/50 ring-1 ring-primary/20" : ""
		}`}
	>
		<CardHeader className="py-3 bg-slate-50 border-b">
			<CardTitle className="text-sm font-bold uppercase tracking-wider text-slate-600">
				{title}
			</CardTitle>
		</CardHeader>
		<div className="overflow-x-auto">
			<Table>
				<TableHeader>
					<TableRow className="bg-white hover:bg-white">
						<TableHead className="w-10 bg-slate-50/50"></TableHead>
						{isSquare
							? choices.map((_: any, i: number) => (
									<TableHead
										key={i}
										className="text-center text-[10px] font-bold"
									>
										A{i + 1}
									</TableHead>
							  ))
							: criteria.map((c: any, i: number) => (
									<TableHead
										key={i}
										className="text-center text-[10px] font-bold"
									>
										{c.name}
									</TableHead>
							  ))}
					</TableRow>
				</TableHeader>
				<TableBody>
					{data.map((row: any, i: number) => (
						<TableRow key={i}>
							<TableCell className="font-bold text-[10px] bg-slate-50/50 text-slate-500">
								A{i + 1}
							</TableCell>
							{row.map((val: number, j: number) => (
								<TableCell
									key={j}
									className={`text-center text-xs font-mono ${
										isBinary && val === 1
											? "text-blue-600 font-bold bg-blue-50/50"
											: ""
									}`}
								>
									{isFloat ? val.toFixed(4) : val}
								</TableCell>
							))}
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	</Card>
);

export default Calculator;

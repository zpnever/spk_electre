/* eslint-disable */

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
	BookOpen,
	History,
	Calculator,
	Info,
	TrendingUp,
	CheckCircle2,
	XCircle,
} from "lucide-react";
import katex from "katex";
// @ts-expect-error error ini
import "katex/dist/katex.min.css";

// Komponen Helper untuk merender Rumus agar tidak error
const Math = ({ formula, displayMode = false }: any) => {
	const html = katex.renderToString(formula, {
		throwOnError: false,
		displayMode: displayMode,
	});

	return <span dangerouslySetInnerHTML={{ __html: html }} />;
};

const AboutElectre = () => {
	return (
		<div className="max-w-4xl mx-auto py-12 px-6 space-y-12 antialiased">
			{/* Header */}
			<section className="text-center space-y-4">
				<h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
					Mengenal Metode ELECTRE
				</h1>
				<p className="text-lg text-muted-foreground max-w-2xl mx-auto">
					Elimination Et Choix Traduisant la Réalité: Pendekatan pengambilan
					keputusan berbasis outranking.
				</p>
			</section>

			{/* Sejarah & Definisi */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
				<Card className="border-none shadow-sm bg-slate-50">
					<CardHeader>
						<CardTitle className="flex items-center gap-2 text-base">
							<History className="w-5 h-5 text-primary" /> Sejarah
						</CardTitle>
					</CardHeader>
					<CardContent className="text-slate-600 leading-relaxed text-sm">
						Metode ini dikembangkan oleh Bernard Roy (1968) sebagai solusi untuk
						masalah kriteria majemuk yang saling bertentangan dalam Multi
						Criteria Decision Making (MCDM).
					</CardContent>
				</Card>

				<Card className="border-none shadow-sm bg-slate-50">
					<CardHeader>
						<CardTitle className="flex items-center gap-2 text-base">
							<BookOpen className="w-5 h-5 text-primary" /> Konsep Outranking
						</CardTitle>
					</CardHeader>
					<CardContent className="text-slate-600 leading-relaxed text-sm">
						ELECTRE membandingkan pasangan alternatif untuk melihat apakah satu
						alternatif "mengalahkan" (outranks) yang lain berdasarkan tingkat
						dominansi.
					</CardContent>
				</Card>
			</div>

			{/* Kelebihan & Kekurangan */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				<div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-100">
					<div className="flex items-center gap-2 mb-4 text-emerald-700 font-bold">
						<CheckCircle2 className="w-5 h-5" /> Kelebihan
					</div>
					<ul className="text-sm text-emerald-900/80 space-y-2">
						<li>• Efektif untuk banyak alternatif.</li>
						<li>• Mampu menangani kriteria yang kontradiktif.</li>
						<li>• Hasil berbasis analisis matematis objektif.</li>
					</ul>
				</div>

				<div className="p-6 rounded-2xl bg-amber-50 border border-amber-100">
					<div className="flex items-center gap-2 mb-4 text-amber-700 font-bold">
						<XCircle className="w-5 h-5" /> Kekurangan
					</div>
					<ul className="text-sm text-amber-900/80 space-y-2">
						<li>• Proses perhitungan cukup panjang/kompleks.</li>
						<li>• Nilai ambang (*threshold*) bisa subjektif.</li>
						<li>• Kurang efektif untuk kriteria yang terlalu sedikit.</li>
					</ul>
				</div>
			</div>

			{/* Langkah Perhitungan */}
			<section className="space-y-8">
				<div className="flex items-center gap-3 border-b pb-4 text-slate-900">
					<Calculator className="w-6 h-6 text-primary" />
					<h2 className="text-2xl font-bold">Langkah-Langkah Perhitungan</h2>
				</div>

				<div className="space-y-8">
					{/* Langkah 1 */}
					<div className="flex gap-6 group">
						<div className="flex-none w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500 group-hover:bg-primary group-hover:text-white transition-colors">
							1
						</div>
						<div className="space-y-3 pt-1 flex-1">
							<h4 className="font-bold text-slate-800 uppercase text-xs tracking-wider">
								Normalisasi Matriks
							</h4>
							<p className="text-sm text-slate-600">
								Mengubah nilai <Math formula="x_{ij}" /> ke skala{" "}
								<Math formula="r_{ij}" /> agar sebanding:
							</p>
							<div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center">
								<Math
									formula="r_{ij} = \frac{x_{ij}}{\sqrt{\sum_{i=1}^{m} x_{ij}^2}}"
									displayMode={true}
								/>
							</div>
						</div>
					</div>

					{/* Langkah 2 */}
					<div className="flex gap-6 group">
						<div className="flex-none w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500 group-hover:bg-primary group-hover:text-white transition-colors">
							2
						</div>
						<div className="space-y-3 pt-1 flex-1">
							<h4 className="font-bold text-slate-800 uppercase text-xs tracking-wider">
								Tabel Preferensi (V)
							</h4>
							<p className="text-sm text-slate-600">
								Dihitung dengan mengalikan bobot kriteria <Math formula="w_j" />
								:
							</p>
							<div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center">
								<Math formula="v_{ij} = w_j \cdot r_{ij}" displayMode={true} />
							</div>
						</div>
					</div>

					{/* Langkah 3 */}
					<div className="flex gap-6 group">
						<div className="flex-none w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500 group-hover:bg-primary group-hover:text-white transition-colors">
							3
						</div>
						<div className="space-y-3 pt-1 flex-1">
							<h4 className="font-bold text-slate-800 uppercase text-xs tracking-wider">
								Indeks Concordance & Discordance
							</h4>
							<p className="text-sm text-slate-600 italic mb-4">
								Membandingkan pasangan alternatif <Math formula="A_k" /> dan{" "}
								<Math formula="A_l" />:
							</p>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div className="bg-white p-4 rounded-xl border border-slate-200">
									<p className="text-[10px] font-bold text-slate-400 mb-2 uppercase">
										Concordance (Ckl)
									</p>
									<Math
										formula="C_{kl} = \{j \mid v_{kj} \geq v_{lj}\}"
										displayMode={true}
									/>
								</div>
								<div className="bg-white p-4 rounded-xl border border-slate-200">
									<p className="text-[10px] font-bold text-slate-400 mb-2 uppercase">
										Discordance (Dkl)
									</p>
									<Math
										formula="D_{kl} = \{j \mid v_{kj} < v_{lj}\}"
										displayMode={true}
									/>
								</div>
							</div>
						</div>
					</div>

					{/* Langkah 4 */}
					<div className="flex gap-6 group">
						<div className="flex-none w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500 group-hover:bg-primary group-hover:text-white transition-colors">
							4
						</div>
						<div className="space-y-3 pt-1 flex-1">
							<h4 className="font-bold text-slate-800 uppercase text-xs tracking-wider">
								Matriks Concordance & Discordance
							</h4>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div className="bg-white p-4 rounded-xl border border-slate-200 overflow-x-auto">
									<Math
										formula="c_{kl} = \sum_{j \in C_{kl}} w_j"
										displayMode={true}
									/>
								</div>
								<div className="bg-white p-4 rounded-xl border border-slate-200 overflow-x-auto">
									<Math
										formula="d_{kl} = \frac{\max_{j \in D_{kl}} |v_{kj} - v_{lj}|}{\max_{\forall j} |v_{kj} - v_{lj}|}"
										displayMode={true}
									/>
								</div>
							</div>
						</div>
					</div>

					{/* Langkah 5 */}
					<div className="flex gap-6 group">
						<div className="flex-none w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500 group-hover:bg-primary group-hover:text-white transition-colors">
							5
						</div>
						<div className="space-y-3 pt-1 flex-1">
							<h4 className="font-bold text-slate-800 uppercase text-xs tracking-wider">
								Dominansi Agregat (E)
							</h4>
							<p className="text-sm text-slate-600 leading-relaxed">
								Menentukan matriks akhir <Math formula="E" /> dengan mengalikan
								elemen matriks dominan <Math formula="F" /> dan{" "}
								<Math formula="G" />:
							</p>
							<div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center">
								<Math
									formula="e_{kl} = f_{kl} \cdot g_{kl}"
									displayMode={true}
								/>
								<p className="text-[10px] mt-3 text-slate-400">
									Jika <Math formula="e_{kl} = 1" />, maka alternatif{" "}
									<Math formula="A_k" /> mendominasi <Math formula="A_l" />.
								</p>
							</div>
						</div>
					</div>
				</div>
			</section>
		</div>
	);
};

export default AboutElectre;

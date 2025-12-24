import React from "react";
import {
	ArrowRight,
	CheckCircle2,
	BarChart3,
	Zap,
	ShieldCheck,
	Layers,
	MousePointerClick,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

const LandingPage = () => {
	return (
		<div className="pt-24 space-y-24 pb-20 overflow-x-hidden">
			{/* --- HERO SECTION --- */}
			<section className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
				<div className="space-y-8 text-center lg:text-left">
					<h1 className="text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.1]">
						Ambil Keputusan <br />
						<span className="text-primary italic">Lebih Presisi</span> <br />
						dengan ELECTRE.
					</h1>
					<p className="text-lg text-slate-600 max-w-xl mx-auto lg:mx-0 leading-relaxed">
						Metode Outranking canggih untuk membantu Anda menyeleksi alternatif
						terbaik di tengah kriteria yang kompleks dan saling bertentangan.
					</p>
					<div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
						<Link
							href="/calculator"
							className="rounded-full flex px-6 py-3 text-base font-bold shadow-xl shadow-primary/25 hover:scale-105 transition-transform"
						>
							Mulai Analisis Sekarang
							<ArrowRight className="ml-2 w-5 h-5" />
						</Link>
						<Link
							href="/electre"
							className="rounded-full px-6 py-3 text-base font-semibold border-slate-200 hover:bg-slate-50"
						>
							Pelajari Teori
						</Link>
					</div>
					<div className="flex items-center justify-center lg:justify-start gap-6 text-slate-400 text-sm">
						<div className="flex items-center gap-2">
							<ShieldCheck className="w-4 h-4" /> Objektif
						</div>
						<div className="flex items-center gap-2">
							<Zap className="w-4 h-4" /> Cepat
						</div>
						<div className="flex items-center gap-2">
							<BarChart3 className="w-4 h-4" /> Akurat
						</div>
					</div>
				</div>

				{/* Hero Visual/Illustration */}
				<div className="relative">
					<div className="absolute inset-0 bg-primary/10 blur-[100px] rounded-full -z-10 animate-pulse"></div>
					<div className="bg-white border border-slate-200 rounded-3xl shadow-2xl p-4 transform rotate-2 hover:rotate-0 transition-transform duration-500">
						<div className="bg-slate-900 rounded-2xl p-6 text-white space-y-4">
							<div className="flex gap-2">
								<div className="w-3 h-3 rounded-full bg-red-500"></div>
								<div className="w-3 h-3 rounded-full bg-amber-500"></div>
								<div className="w-3 h-3 rounded-full bg-emerald-500"></div>
							</div>
							<div className="space-y-3 pt-2">
								<div className="h-4 w-3/4 bg-slate-700 rounded-full"></div>
								<div className="h-4 w-1/2 bg-slate-700 rounded-full"></div>
								<div className="grid grid-cols-3 gap-2 pt-4">
									<div className="h-20 bg-primary/20 border border-primary/30 rounded-lg flex items-end p-2">
										<div className="w-full h-1/2 bg-primary rounded"></div>
									</div>
									<div className="h-20 bg-primary/20 border border-primary/30 rounded-lg flex items-end p-2">
										<div className="w-full h-3/4 bg-primary rounded"></div>
									</div>
									<div className="h-20 bg-primary/20 border border-primary/30 rounded-lg flex items-end p-2">
										<div className="w-full h-full bg-primary rounded"></div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* --- FEATURES SECTION --- */}
			<section className="bg-slate-50 py-24">
				<div className="max-w-7xl mx-auto px-6 text-center space-y-4 mb-16">
					<h2 className="text-3xl font-bold text-slate-900">
						Mengapa Menggunakan ELECTRE?
					</h2>
					<p className="text-slate-500 max-w-2xl mx-auto text-lg">
						ELECTRE (Elimination Et Choix Traduisant la Réalité) memberikan
						keunggulan dibanding metode ranking konvensional.
					</p>
				</div>

				<div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
					{[
						{
							icon: <Layers className="text-blue-600" />,
							title: "Kompleksitas Tinggi",
							desc: "Dirancang khusus untuk menangani situasi di mana banyak kriteria berbeda saling bertarung.",
						},
						{
							icon: <Zap className="text-amber-600" />,
							title: "Efek Dominansi",
							desc: "Mengeliminasi alternatif yang kurang menguntungkan melalui matriks concordance dan discordance.",
						},
						{
							icon: <CheckCircle2 className="text-emerald-600" />,
							title: "Hasil Objektif",
							desc: "Menghilangkan bias subjektif dengan perhitungan matematis yang ketat dan nilai ambang.",
						},
					].map((item, idx) => (
						<div
							key={idx}
							className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow group"
						>
							<div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary/5 transition-colors">
								{item.icon}
							</div>
							<h3 className="text-xl font-bold text-slate-900 mb-3">
								{item.title}
							</h3>
							<p className="text-slate-500 leading-relaxed">{item.desc}</p>
						</div>
					))}
				</div>
			</section>

			{/* --- WORKFLOW SECTION --- */}

			<section className="max-w-5xl mx-auto px-6">
				<div className="text-center mb-16">
					<h2 className="text-3xl font-bold text-slate-900">
						Cara Kerja Aplikasi
					</h2>
				</div>

				<div className="relative">
					{/* Line decoration */}
					<div className="absolute left-8 top-0 bottom-0 w-0.5 bg-slate-100 hidden md:block"></div>

					<div className="space-y-12">
						{[
							{
								step: "01",
								title: "Input Alternatif & Kriteria",
								desc: "Masukkan semua pilihan yang tersedia beserta kriteria penilaian yang diinginkan.",
							},
							{
								step: "02",
								title: "Tentukan Bobot",
								desc: "Berikan tingkat kepentingan pada setiap kriteria untuk mencerminkan preferensi Anda.",
							},
							{
								step: "03",
								title: "Hasil Outranking",
								desc: "Lihat hasil analisis instan berupa alternatif yang paling mendominasi pilihan lainnya.",
							},
						].map((item, idx) => (
							<div key={idx} className="flex gap-8 items-start relative">
								<div className="w-16 h-16 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-xl font-bold text-primary shadow-sm z-10 shrink-0">
									{item.step}
								</div>
								<div className="pt-2">
									<h4 className="text-xl font-bold text-slate-900 mb-2">
										{item.title}
									</h4>
									<p className="text-slate-500">{item.desc}</p>
								</div>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* --- CTA SECTION --- */}
			<section className="max-w-7xl mx-auto px-6">
				<div className="bg-primary rounded-[3rem] p-12 lg:p-20 text-center text-white space-y-8 relative overflow-hidden shadow-2xl shadow-primary/30">
					<div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
					<div className="absolute bottom-0 left-0 w-64 h-64 bg-slate-900/20 rounded-full -ml-32 -mb-32 blur-3xl"></div>

					<h2 className="text-4xl lg:text-5xl font-extrabold">
						Siap membuat keputusan yang tepat?
					</h2>
					<p className="text-primary-foreground/80 text-lg max-w-2xl mx-auto">
						Hentikan keraguan. Gunakan kekuatan matematika untuk menentukan
						pilihan terbaik Anda hari ini.
					</p>
					<div className="flex justify-center">
						<Link
							href="/calculator"
							className="bg-white text-primary hover:bg-slate-100 rounded-full px-10 py-7 text-lg font-bold flex"
						>
							<MousePointerClick className="mr-2" />
							Coba Kalkulator Sekarang
						</Link>
					</div>
				</div>
			</section>
		</div>
	);
};

export default LandingPage;

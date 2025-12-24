import React from "react";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, BookOpen, GraduationCap, Code2 } from "lucide-react";
import Image from "next/image";

const About = () => {
	// Data Anggota Kelompok berdasarkan laporan
	const teamMembers = [
		{
			name: "Naylah Haniifah Ramadhani",
			id: "1512623003",
			src: "/profile/naylah.jpeg",
		},
		{
			name: "Defa Rahmita Rifqi R.",
			id: "1512623005",
			src: "/profile/depa.jpeg",
		},
		{ name: "Muhammad Akhyar", id: "1512623020", src: "/profile/akhyar.jpeg" },
		{
			name: "Danu Suko Handiyanto",
			id: "1512623038",
			src: "/profile/danu.jpeg",
		},
		{ name: "Nabila Aristi", id: "1512623040", src: "/profile/nabila.jpeg" },
		{
			name: "Ganendra Rizky Deniartra",
			id: "1512623044",
			src: "/profile/ganen.jpeg",
		},
	];

	return (
		<div className="max-w-6xl mx-auto py-12 px-6 space-y-16">
			{/* Hero Section: Judul Proyek  */}
			<section className="text-center space-y-4">
				<h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
					About Us
				</h1>
			</section>

			{/* Deskripsi & Tujuan Proyek [cite: 15, 16] */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
				<Card className="border-none shadow-md bg-slate-50">
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<BookOpen className="w-5 h-5 text-primary" />
							Tujuan Aplikasi
						</CardTitle>
					</CardHeader>
					<CardContent className="text-slate-600 leading-relaxed italic">
						Aplikasi ini disusun dalam rangka memenuhi tugas Ujian Akhir
						Semester (UAS) mata kuliah Sistem Pendukung Keputusan. Tujuannya
						adalah menerapkan metode <i>Multi Criteria Decision Making</i>{" "}
						(MCDM) ELECTRE untuk membantu pengambil keputusan memilih alternatif
						beton terbaik di tengah kriteria yang saling bertentangan.
					</CardContent>
				</Card>

				<Card className="border-none shadow-md bg-slate-50">
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<GraduationCap className="w-5 h-5 text-primary" />
							Informasi Akademik
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-2 text-slate-600 font-medium">
						<div className="pt-2  border-slate-200 mt-2">
							<p className="text-xs font-bold uppercase text-slate-400">
								Mata Kuliah:
							</p>
							<p className="text-sm">Sistem Pendukung Keputusan</p>
						</div>
						<div className="pt-2 border-t border-slate-200 mt-2">
							<p className="text-xs font-bold uppercase text-slate-400">
								Dosen Pengampu:
							</p>
							<p className="text-sm">
								Via Tuhamah Fauziastuti, S.Si., M.Ed, CSA
							</p>
							<p className="text-sm">Ressy Dwitias Sari, S.T., M.T.I., CSA</p>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Grid Anggota Kelompok*/}
			<section className="space-y-8">
				<div className="text-center space-y-2">
					<h2 className="text-3xl font-bold flex items-center justify-center gap-2">
						<Users className="text-primary" /> Tim Penyusun (Kelompok 3)
					</h2>
					<p className="text-muted-foreground italic">
						Kolaborasi kelompok 3 untuk pengembangan Sistem Pendukung Keputusan
						berbasis Web.
					</p>
				</div>

				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
					{teamMembers.map((member, index) => (
						<Card
							key={index}
							className="overflow-hidden border-slate-100 hover:shadow-xl transition-shadow group"
						>
							{/* Placeholder Tempat Foto Anggota [cite: 475] */}
							<div className="aspect-[4/5] bg-slate-200 relative overflow-hidden">
								<Image
									src={member.src}
									alt={member.name}
									fill
									className="object-cover"
								/>
							</div>

							<CardContent className="p-5 text-center">
								<h3 className="font-bold text-lg text-slate-800">
									{member.name}
								</h3>
								<p className="text-primary text-sm font-mono mb-2">
									{member.id}
								</p>
							</CardContent>
						</Card>
					))}
				</div>
			</section>

			{/* Tech Stack yang Digunakan [cite: 48, 264] */}
			<section className="pt-10 border-t border-slate-100">
				<div className="flex flex-wrap justify-center gap-8 opacity-60 grayscale hover:grayscale-0 transition-all">
					<div className="flex items-center gap-2 font-bold text-slate-500">
						<Code2 size={20} /> Built with: TypeScript, Next.js, React, Express,
						PostgreSQL & Prisma
					</div>
				</div>
			</section>
		</div>
	);
};

export default About;

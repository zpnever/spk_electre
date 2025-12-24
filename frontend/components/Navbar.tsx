"use client";
import React, { useState } from "react";
import { Menu, X, Zap, ChevronRight } from "lucide-react";

const Navbar = () => {
	const [isOpen, setIsOpen] = useState(false);

	const navLinks = [
		{ name: "Home", href: "/" },
		{ name: "About Electre", href: "/electre" },
		{ name: "Calculator", href: "/calculator" },
		{ name: "Template", href: "/template" },
		{ name: "About Us", href: "/about" },
	];

	return (
		<nav className="fixed w-full z-50 top-0 left-0 bg-white/80 backdrop-blur-md border-b border-slate-100">
			<div className="max-w-7xl mx-auto px-6">
				<div className="flex justify-between items-center h-16">
					{/* Logo Area */}
					<div className="flex items-center gap-2 group cursor-pointer">
						<div className="bg-primary p-1.5 rounded-lg text-white group-hover:rotate-12 transition-transform">
							<Zap size={20} fill="currentColor" />
						</div>
						<span className="text-xl font-bold tracking-tight text-slate-900">
							ELECTRE<span className="text-primary">.3</span>
						</span>
					</div>

					{/* Desktop Menu */}
					<div className="hidden md:flex items-center gap-8">
						{navLinks.map((link) => (
							<a
								key={link.name}
								href={link.href}
								className="text-sm font-medium text-slate-600 hover:text-primary transition-colors"
							>
								{link.name}
							</a>
						))}
					</div>

					{/* Mobile Menu Button */}
					<div className="md:hidden flex items-center">
						<button
							onClick={() => setIsOpen(!isOpen)}
							className="text-slate-600 hover:text-primary transition-colors p-2"
						>
							{isOpen ? <X size={24} /> : <Menu size={24} />}
						</button>
					</div>
				</div>
			</div>

			{/* Mobile Side Menu (Overlay) */}
			<div
				className={`md:hidden absolute w-full bg-white border-b border-slate-100 transition-all duration-300 ease-in-out ${
					isOpen
						? "opacity-100 translate-y-0"
						: "opacity-0 -translate-y-4 pointer-events-none"
				}`}
			>
				<div className="px-6 pt-2 pb-6 space-y-2 shadow-xl">
					{navLinks.map((link) => (
						<a
							key={link.name}
							href={link.href}
							className="block py-3 text-base font-medium text-slate-600 border-b border-slate-50 last:border-none hover:text-primary"
							onClick={() => setIsOpen(false)}
						>
							{link.name}
						</a>
					))}
				</div>
			</div>
		</nav>
	);
};

export default Navbar;

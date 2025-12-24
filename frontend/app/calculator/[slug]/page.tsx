import Calculator from "@/components/CalculatorTemplate";

export default async function Page({
	params,
}: {
	params: Promise<{ slug: string }>;
}) {
	const { slug } = await params;

	return (
		<div>
			<Calculator id={slug} />
		</div>
	);
}

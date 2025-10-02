'use client';
import queryClient from '@/tanstack/queryClient';
import ProductCard from '../Shared/ProductCard';
import { QueryClientProvider, useQuery } from '@tanstack/react-query';

function RecommendedProductsContent() {
	const { status, data, error } = useQuery({
		queryKey: ['recommendedProducts'],
		queryFn: async () => {
			const resp = await fetch(
				`${process.env.NEXT_PUBLIC_API_BASE}/products/byCount/8`
			);
			if (!resp.ok) throw new Error('API error');
			const json = await resp.json();
			return json.data;
		},
		staleTime: 1000 * 60 * 60 * 24,
		refetchOnWindowFocus: false,
	});

	if (status === 'loading') return <div>Loading...</div>;
	if (status === 'error') return <div>Error: {error.message}</div>;

	return (
		<>
			<h1 className="text-center text-2xl font-bold my-4">
				Recommended Products
			</h1>

			<div
				style={{
					display: 'flex',
					gap: '1rem',
					overflowX: 'auto',
					padding: '1rem',
				}}
			>
				{data &&
					data.map((product) => (
						<div key={product.id} style={{ minWidth: 200 }}>
							<ProductCard product={product} />
						</div>
					))}
			</div>
		</>
	);
}

export default function RecommendedProducts() {
	return (
		<QueryClientProvider client={queryClient}>
			<RecommendedProductsContent />
		</QueryClientProvider>
	);
}

'use client';
import { useParams, useRouter } from 'next/navigation';
import {
	Container,
	Title,
	Text,
	SimpleGrid,
	Card,
	Image,
	Group,
	Badge,
	Stack,
	Select,
	NumberInput,
	Button,
	Collapse,
	Divider,
	Loader,
	Center,
} from '@mantine/core';
import { useEffect, useState } from 'react';

export default function CategoryPage() {
	const { slug } = useParams();
	const router = useRouter();

	const [minPrice, setMinPrice] = useState<number | ''>('');
	const [maxPrice, setMaxPrice] = useState<number | ''>('');
	const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | ''>('');
	const [filterOpen, setFilterOpen] = useState(false);

	const [products, setProducts] = useState<null | any[]>(null);
	const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
	const [error, setError] = useState(false);

	useEffect(() => {
		if (!slug) {
			router.back();
			return;
		}

		async function fetchCategoryProducts() {
			try {
				const resp = await fetch(
					`${process.env.NEXT_PUBLIC_API_BASE}/products/byCategory/${slug}`
				);
				if (!resp.ok) throw new Error('API error');
				const json = await resp.json();
				setProducts(json.data);
				setFilteredProducts(json.data);
			} catch (err) {
				setError(true);
			}
		}

		fetchCategoryProducts();
	}, [slug]);

	const applyFilters = () => {
		if (!products) return;

		let result = [...products];

		result = result.filter((product) => {
			const price = parseFloat(product.price.replace('$', ''));
			if (minPrice !== '' && price < minPrice) return false;
			if (maxPrice !== '' && price > maxPrice) return false;
			return true;
		});

		if (sortOrder === 'asc') {
			result.sort(
				(a, b) =>
					parseFloat(a.price.replace('$', '')) -
					parseFloat(b.price.replace('$', ''))
			);
		} else if (sortOrder === 'desc') {
			result.sort(
				(a, b) =>
					parseFloat(b.price.replace('$', '')) -
					parseFloat(a.price.replace('$', ''))
			);
		}

		setFilteredProducts(result);
	};

	return (
		<Container size="xl" py="md">
			<Title order={3} mb="md">
				Category:{' '}
				<Text span c="brown">
					{slug}
				</Text>
			</Title>

			<Group justify="space-between" mb="md">
				<Button variant="light" onClick={() => setFilterOpen((o) => !o)}>
					{filterOpen ? 'Hide Filters' : 'Show Filters'}
				</Button>
			</Group>

			<Collapse in={filterOpen}>
				<Stack mb="lg" gap="xs">
					<Group grow>
						<NumberInput
							label="Min Price"
							placeholder="e.g. 5"
							value={minPrice}
							onChange={setMinPrice}
							min={0}
						/>
						<NumberInput
							label="Max Price"
							placeholder="e.g. 30"
							value={maxPrice}
							onChange={setMaxPrice}
							min={0}
						/>
					</Group>
					<Select
						label="Sort by Price"
						placeholder="Select order"
						data={[
							{ value: 'asc', label: 'Price: Low to High' },
							{ value: 'desc', label: 'Price: High to Low' },
						]}
						value={sortOrder}
						onChange={(value) => setSortOrder(value as 'asc' | 'desc')}
					/>
					<Button onClick={applyFilters} color="brown" mt="sm">
						Apply Filters
					</Button>
				</Stack>
				<Divider mb="md" />
			</Collapse>

			{error ? (
				<Text c="red" ta="center">
					An error occurred while fetching products.
				</Text>
			) : products === null ? (
				<Center>
					<Loader color="brown" />
				</Center>
			) : filteredProducts.length > 0 ? (
				<SimpleGrid cols={{ base: 2, sm: 2, md: 3, lg: 4, xl: 5 }} spacing="md">
					{filteredProducts.map((product) => (
						<Card
							key={product.id}
							shadow="md"
							padding="sm"
							radius="md"
							withBorder
							style={{
								cursor: 'pointer',
								backgroundColor: '#fffaf5',
								transition: 'transform 0.2s ease',
							}}
							onClick={() => router.push(`/product/${product.id}`)}
							onMouseEnter={(e) =>
								(e.currentTarget.style.transform = 'scale(1.02)')
							}
							onMouseLeave={(e) =>
								(e.currentTarget.style.transform = 'scale(1)')
							}
						>
							<Card.Section>
								<Image
									src={product.image}
									alt={product.name}
									height={80}
									fit="contain"
									style={{ objectFit: 'cover', padding: '4px' }}
								/>
							</Card.Section>

							<Stack gap={4} mt="xs">
								<Group justify="space-between">
									<Text fw={600} size="sm" c="#4b3f2f">
										{product.name}
									</Text>
									<Badge color="orange" size="sm" variant="light">
										{product.category}
									</Badge>
								</Group>

								<Text size="xs" c="dimmed" lineClamp={2}>
									{product.description}
								</Text>

								<Text fw={700} size="sm" c="#a9744f">
									{product.price}$
								</Text>
							</Stack>
						</Card>
					))}
				</SimpleGrid>
			) : (
				<Text c="dimmed" ta="center">
					No products found in this category.
				</Text>
			)}
		</Container>
	);
}

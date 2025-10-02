'use client';
import { useRouter } from 'next/navigation';
import { Card, Image, Group, Text, Badge, Stack } from '@mantine/core';

type Product = {
	id: string;
	name: string;
	image: string;
	description: string;
	price: string;
	category: string;
};

export default function ProductCard({ product }: { product: Product }) {
	const router = useRouter();

	return (
		<Card
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
			onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.02)')}
			onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
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
	);
}

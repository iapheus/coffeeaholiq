'use client';
import { useParams } from 'next/navigation';
import {
	Container,
	Title,
	Text,
	Image,
	Badge,
	Group,
	Button,
	Stack,
	Divider,
	Paper,
	Textarea,
	Rating,
	Loader,
	Center,
} from '@mantine/core';
import { useState, useEffect } from 'react';

export default function ProductPage() {
	const { slug } = useParams();

	const [product, setProduct] = useState<any | null>(null);
	const [filteredReviews, setFilteredReviews] = useState<any[]>([]);
	const [error, setError] = useState(false);
	const [loading, setLoading] = useState(true);

	const [reviewText, setReviewText] = useState('');
	const [reviewRating, setReviewRating] = useState(0);
	const [addedMessageVisible, setAddedMessageVisible] = useState(false);

	useEffect(() => {
		if (!slug) return;

		async function fetchProduct() {
			try {
				const resp = await fetch(
					`${process.env.NEXT_PUBLIC_API_BASE}/products/${slug}`
				);
				if (!resp.ok) throw new Error('API error');
				const json = await resp.json();
				setProduct(json.data);
			} catch {
				setError(true);
			} finally {
				setLoading(false);
			}
		}

		fetchProduct();
	}, [slug]);

	useEffect(() => {
		async function fetchReviews() {
			try {
				const resp = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/reviews`);
				if (!resp.ok) throw new Error('Review fetch error');
				const json = await resp.json();
				if (product?.id) {
					const matched = json.data.filter(
						(review: any) => review.product_id === product.id
					);
					setFilteredReviews(matched);
				}
			} catch (err) {
				console.error('Review fetch failed:', err);
			}
		}

		if (product?.id) {
			fetchReviews();
		}
	}, [product]);

	if (loading) {
		return (
			<Center py="xl">
				<Loader color="brown" />
			</Center>
		);
	}

	if (error || !product) {
		return (
			<Container size="sm" py="xl" style={{ textAlign: 'center' }}>
				<Title order={2} c="red" mb="sm">
					Product Not Found
				</Title>
				<Text size="sm" c="dimmed">
					The product you're looking for doesn't exist or has been removed.
				</Text>
			</Container>
		);
	}

	return (
		<Container size="md" py="xl">
			<Group align="flex-start" gap="xl">
				<Image
					src={product.image}
					alt={product.name}
					w={180}
					h={180}
					radius="md"
					style={{ objectFit: 'cover' }}
				/>

				<Stack gap="xs" style={{ flex: 1 }}>
					<Group justify="space-between">
						<Title order={3}>{product.name}</Title>
						<Badge color="orange" size="sm" variant="light">
							{product.category}
						</Badge>
					</Group>

					<Text size="sm" c="dimmed">
						{product.description}
					</Text>

					<Divider my="sm" />

					<Group justify="space-between">
						<Text fw={700} size="lg" c="blue">
							{product.price}$
						</Text>
						<Button
							color="brown"
							radius="md"
							onClick={() => {
								const existingCart = localStorage.getItem('cartItems');
								let cart = existingCart ? JSON.parse(existingCart) : [];

								const existingIndex = cart.findIndex(
									(item: any) => item.id === product.id
								);
								if (existingIndex !== -1) {
									cart[existingIndex].quantity += 1;
								} else {
									cart.push({ ...product, quantity: 1 });
								}

								localStorage.setItem('cartItems', JSON.stringify(cart));
								setAddedMessageVisible(true);
								setTimeout(() => setAddedMessageVisible(false), 3000);
							}}
						>
							Add to Cart
						</Button>
						{addedMessageVisible && (
							<Text c="green" size="sm" mt="xs">
								{product.name} has been added to your cart!
							</Text>
						)}
					</Group>

					<Text size="xs" c="gray">
						Quantity: {product.quantity}
					</Text>
				</Stack>
			</Group>

			<Divider my="xl" />

			<Title order={4} mb="sm">
				Reviews
			</Title>

			{filteredReviews.length > 0 ? (
				<Stack gap="sm">
					{filteredReviews.map((review: any, index: number) => (
						<Paper key={index} shadow="xs" p="md" radius="md" withBorder>
							<Group justify="space-between" mb="xs">
								<Text fw={600}>User #{review.user_id}</Text>
								<Badge color="yellow">{review.rating} ★</Badge>
							</Group>
							<Text size="sm" c="dimmed">
								{review.comment}
							</Text>
						</Paper>
					))}
				</Stack>
			) : (
				<Text c="dimmed">No reviews yet.</Text>
			)}

			<Divider my="xl" />
			<Title order={4} mb="sm">
				Add a Review
			</Title>
			<Stack gap="sm">
				<Rating value={reviewRating} onChange={setReviewRating} />
				<Textarea
					placeholder="Write your review..."
					value={reviewText}
					onChange={(e) => setReviewText(e.currentTarget.value)}
					autosize
					minRows={3}
				/>
				<Button
					onClick={async () => {
						try {
							const token = localStorage.getItem('Authorization');
							if (!token) return;

							const response = await fetch(
								`${process.env.NEXT_PUBLIC_API_BASE}/reviews`,
								{
									method: 'POST',
									headers: {
										'Content-Type': 'application/json',
										Authorization: `Bearer ${token}`,
									},
									body: JSON.stringify({
										product_id: product.id,
										rating: reviewRating,
										comment: reviewText,
									}),
								}
							);

							const result = await response.json();
							if (!response.ok) throw new Error(result.error);

							setFilteredReviews((prev) => [
								...prev,
								{
									user_id: 'You',
									rating: reviewRating,
									comment: reviewText,
								},
							]);

							setReviewText('');
							setReviewRating(0);
						} catch (err: any) {
							console.error('Review submission error:', err.message);
						}
					}}
					disabled={reviewRating === 0 || reviewText.trim() === ''}
					color="brown"
				>
					Submit Review
				</Button>
			</Stack>
		</Container>
	);
}

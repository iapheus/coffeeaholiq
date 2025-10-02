'use client';
import { useEffect, useState } from 'react';
import {
	Table,
	Button,
	Text,
	Group,
	Modal,
	Textarea,
	Rating,
	TextInput,
	Select,
} from '@mantine/core';

export default function ReviewsView() {
	const [reviews, setReviews] = useState<any[]>([]);
	const [opened, setOpened] = useState(false);
	const [editing, setEditing] = useState<any | null>(null);
	const [comment, setComment] = useState('');
	const [rating, setRating] = useState(0);
	const [productId, setProductId] = useState('');
	const [products, setProducts] = useState<any[]>([]);

	useEffect(() => {
		fetchReviews();
		fetchProducts();
	}, []);

	async function fetchReviews() {
		const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/reviews`);
		const json = await res.json();
		setReviews(json.data);
	}

	async function fetchProducts() {
		const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/products`);
		const json = await res.json();
		setProducts(json.data);
	}

	async function handleSave() {
		const token = localStorage.getItem('AdminToken');
		const method = editing ? 'PATCH' : 'POST';
		const url = editing
			? `${process.env.NEXT_PUBLIC_API_BASE}/reviews/${editing.id}`
			: `${process.env.NEXT_PUBLIC_API_BASE}/reviews`;

		const res = await fetch(url, {
			method,
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify({
				product_id: parseInt(productId),
				rating,
				comment,
			}),
		});

		if (res.ok) {
			setOpened(false);
			setEditing(null);
			setComment('');
			setRating(0);
			setProductId('');
			fetchReviews();
		}
	}

	async function handleDelete(id: number) {
		const token = localStorage.getItem('AdminToken');
		const res = await fetch(
			`${process.env.NEXT_PUBLIC_API_BASE}/reviews/admin/${id}`,
			{
				method: 'DELETE',
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}
		);
		if (res.ok) fetchReviews();
	}

	return (
		<div>
			<Text size="xl" fw={700} mb="md">
				Reviews Management
			</Text>
			<Button mb="md" onClick={() => setOpened(true)}>
				Add Review
			</Button>
			<Table striped highlightOnHover>
				<Table.Thead>
					<tr>
						<th>ID</th>
						<th>User</th>
						<th>Product</th>
						<th>Rating</th>
						<th>Comment</th>
						<th>Actions</th>
					</tr>
				</Table.Thead>
				<Table.Tbody>
					{reviews.map((review) => (
						<tr key={review.id}>
							<td>{review.id}</td>
							<td>{review.user_id}</td>
							<td>{review.product_id}</td>
							<td>{review.rating}</td>
							<td>{review.comment}</td>
							<td>
								<Group gap="xs">
									<Button
										size="xs"
										onClick={() => {
											setEditing(review);
											setComment(review.comment);
											setRating(review.rating);
											setProductId(String(review.product_id));
											setOpened(true);
										}}
									>
										Edit
									</Button>
									<Button
										size="xs"
										color="red"
										onClick={() => handleDelete(review.id)}
									>
										Delete
									</Button>
								</Group>
							</td>
						</tr>
					))}
				</Table.Tbody>
			</Table>

			<Modal
				opened={opened}
				onClose={() => {
					setOpened(false);
					setEditing(null);
					setComment('');
					setRating(0);
					setProductId('');
				}}
				title={editing ? 'Edit Review' : 'Add Review'}
			>
				<Select
					label="Product"
					placeholder="Select product"
					data={products.map((p) => ({
						value: String(p.id),
						label: p.name,
					}))}
					value={productId}
					onChange={setProductId}
					mb="md"
				/>
				<Rating value={rating} onChange={setRating} mb="md" />
				<Textarea
					value={comment}
					onChange={(e) => setComment(e.currentTarget.value)}
					placeholder="Comment"
				/>
				<Button fullWidth mt="md" onClick={handleSave} color="brown">
					{editing ? 'Update' : 'Create'}
				</Button>
			</Modal>
		</div>
	);
}

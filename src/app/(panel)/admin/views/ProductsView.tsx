'use client';
import { useEffect, useState } from 'react';
import {
	Table,
	Button,
	Text,
	Group,
	Modal,
	TextInput,
	Select,
	NumberInput,
} from '@mantine/core';

export default function ProductsView() {
	const [products, setProducts] = useState<any[]>([]);
	const [opened, setOpened] = useState(false);
	const [editing, setEditing] = useState<any | null>(null);
	const [name, setName] = useState('');
	const [category, setCategory] = useState('');
	const [price, setPrice] = useState<number | ''>('');
	const [quantity, setQuantity] = useState<number | ''>('');

	useEffect(() => {
		fetchProducts();
	}, []);

	async function fetchProducts() {
		const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/products`);
		const json = await res.json();
		setProducts(json.data);
	}

	async function handleSave() {
		const token = localStorage.getItem('AdminToken');
		const method = editing ? 'PATCH' : 'POST';
		const url = editing
			? `${process.env.NEXT_PUBLIC_API_BASE}/products/${editing.id}`
			: `${process.env.NEXT_PUBLIC_API_BASE}/products`;

		const res = await fetch(url, {
			method,
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify({
				name,
				category,
				price: price.toString(),
				quantity,
			}),
		});

		if (res.ok) {
			setOpened(false);
			resetForm();
			fetchProducts();
		}
	}

	async function handleDelete(id: number) {
		const token = localStorage.getItem('AdminToken');
		const res = await fetch(
			`${process.env.NEXT_PUBLIC_API_BASE}/products/${id}`,
			{
				method: 'DELETE',
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}
		);
		if (res.ok) fetchProducts();
	}

	function resetForm() {
		setEditing(null);
		setName('');
		setCategory('');
		setPrice('');
		setQuantity('');
	}

	return (
		<div>
			<Text size="xl" fw={700} mb="md">
				Products Management
			</Text>
			<Button mb="md" onClick={() => setOpened(true)}>
				Add Product
			</Button>
			<Table striped highlightOnHover>
				<Table.Thead>
					<tr>
						<th>ID</th>
						<th>Name</th>
						<th>Category</th>
						<th>Price</th>
						<th>Quantity</th>
						<th>Actions</th>
					</tr>
				</Table.Thead>
				<Table.Tbody>
					{products.map((product) => (
						<tr key={product.id}>
							<td>{product.id}</td>
							<td>{product.name}</td>
							<td>{product.category}</td>
							<td>{product.price}</td>
							<td>{product.quantity}</td>
							<td>
								<Group gap="xs">
									<Button
										size="xs"
										onClick={() => {
											setEditing(product);
											setName(product.name);
											setCategory(product.category);
											setPrice(product.price);
											setQuantity(product.quantity);
											setOpened(true);
										}}
									>
										Edit
									</Button>
									<Button
										size="xs"
										color="red"
										onClick={() => handleDelete(product.id)}
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
					resetForm();
				}}
				title={editing ? 'Edit Product' : 'Add Product'}
			>
				<TextInput
					label="Name"
					value={name}
					onChange={(e) => setName(e.currentTarget.value)}
					mb="md"
				/>
				<Select
					label="Category"
					placeholder="Select category"
					data={[
						{ value: 'coffee', label: 'Coffee' },
						{ value: 'accessory', label: 'Accessory' },
						{ value: 'equipment', label: 'Equipment' },
					]}
					value={category}
					onChange={setCategory}
					mb="md"
				/>
				<NumberInput
					label="Price"
					value={price}
					onChange={setPrice}
					mb="md"
					min={0}
				/>
				<NumberInput
					label="Quantity"
					value={quantity}
					onChange={setQuantity}
					mb="md"
					min={0}
				/>
				<Button fullWidth mt="md" onClick={handleSave} color="brown">
					{editing ? 'Update' : 'Create'}
				</Button>
			</Modal>
		</div>
	);
}

'use client';
import {
	Container,
	Title,
	Text,
	Group,
	Image,
	Stack,
	Button,
	Divider,
	Paper,
} from '@mantine/core';
import { useState, useEffect } from 'react';

export default function CartPage() {
	const [cart, setCart] = useState<any[]>([]);

	useEffect(() => {
		const storedCart = localStorage.getItem('cartItems');
		if (storedCart) {
			setCart(JSON.parse(storedCart));
		}
	}, []);

	const removeItem = (id: string) => {
		const updatedCart = cart.filter((item) => item.id !== id);
		setCart(updatedCart);
		localStorage.setItem('cartItems', JSON.stringify(updatedCart));
	};

	const total = cart.reduce(
		(sum, item) =>
			sum + parseFloat(item.price.replace('$', '')) * item.quantity,
		0
	);

	return (
		<Container size="md" py="xl">
			<Title order={2} mb="lg" ta="center">
				Your Cart
			</Title>

			{cart.length > 0 ? (
				<Stack gap="md">
					{cart.map((item) => (
						<Paper key={item.id} shadow="xs" p="md" radius="md" withBorder>
							<Group justify="space-between" align="center">
								<Group>
									<Image
										src={item.image}
										alt={item.name}
										w={60}
										h={60}
										radius="md"
										style={{ objectFit: 'cover' }}
									/>
									<Stack gap={2}>
										<Text fw={600}>{item.name}</Text>
										<Text size="sm" c="dimmed">
											Price: {item.price} × {item.quantity}
										</Text>
									</Stack>
								</Group>
								<Button
									variant="light"
									color="red"
									size="xs"
									onClick={() => removeItem(item.id)}
								>
									Remove
								</Button>
							</Group>
						</Paper>
					))}

					<Divider />

					<Group justify="space-between">
						<Text fw={700} size="lg" c="#a9744f">
							Total: ${total.toFixed(2)}
						</Text>
						<Button color="brown" radius="md">
							Checkout
						</Button>
					</Group>
				</Stack>
			) : (
				<Text ta="center" c="dimmed">
					Your cart is empty.
				</Text>
			)}
		</Container>
	);
}

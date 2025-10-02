'use client';
import {
	Container,
	Title,
	TextInput,
	PasswordInput,
	Button,
	Stack,
	Text,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useState } from 'react';

export default function RegisterPage() {
	const [responseMessage, setResponseMessage] = useState('');
	const [responseColor, setResponseColor] = useState<'red' | 'green'>('green');

	const form = useForm({
		initialValues: {
			firstName: '',
			lastName: '',
			email: '',
			password: '',
		},
		validate: {
			firstName: (value) =>
				value.trim().length < 2
					? 'First name must be at least 2 characters'
					: null,
			lastName: (value) =>
				value.trim().length < 2
					? 'Last name must be at least 2 characters'
					: null,
			email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
			password: (value) =>
				value.length < 6 ? 'Password must be at least 6 characters' : null,
		},
	});

	const handleSubmit = async (values: typeof form.values) => {
		try {
			const resp = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/users`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(values),
			});

			const data = await resp.json();

			if (resp.ok && data.success) {
				setResponseMessage(data.message || 'User created!');
				setResponseColor('green');
				form.reset();
			} else {
				setResponseMessage(
					data.message || data.error || 'Registration failed.'
				);
				setResponseColor('red');
			}
		} catch (err) {
			setResponseMessage('Something went wrong. Please try again.');
			setResponseColor('red');
		}
	};

	return (
		<Container size="xs" py="xl">
			<Title order={2} mb="lg" ta="center">
				Register
			</Title>

			<form onSubmit={form.onSubmit(handleSubmit)}>
				<Stack>
					<TextInput
						label="First Name"
						placeholder="John"
						{...form.getInputProps('firstName')}
					/>
					<TextInput
						label="Last Name"
						placeholder="Doe"
						{...form.getInputProps('lastName')}
					/>
					<TextInput
						label="Email"
						placeholder="you@example.com"
						{...form.getInputProps('email')}
					/>
					<PasswordInput
						label="Password"
						placeholder="Create a password"
						{...form.getInputProps('password')}
					/>
					<Button type="submit" fullWidth color="dark">
						Register
					</Button>

					{responseMessage && (
						<Text ta="center" c={responseColor}>
							{responseMessage}
						</Text>
					)}
				</Stack>
			</form>
		</Container>
	);
}

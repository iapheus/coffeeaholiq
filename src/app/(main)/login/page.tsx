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
import { useRouter } from 'next/navigation';

export default function LoginPage() {
	const router = useRouter();
	const [responseMessage, setResponseMessage] = useState('');
	const [responseColor, setResponseColor] = useState<'red' | 'green'>('green');

	const form = useForm({
		initialValues: {
			email: '',
			password: '',
		},
		validate: {
			email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
			password: (value) =>
				value.length < 6 ? 'Password must be at least 6 characters' : null,
		},
	});

	const handleLogin = async (values: typeof form.values) => {
		try {
			const resp = await fetch(
				`${process.env.NEXT_PUBLIC_API_BASE}/users/auth/login`,
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify(values),
				}
			);

			const data = await resp.json();

			if (resp.ok && data.success) {
				localStorage.setItem('Authorization', data.data);
				setResponseMessage('Login successful!');
				setResponseColor('green');
				form.reset();

				setTimeout(() => {
					router.push('/profile');
				}, 1000);
			} else {
				setResponseMessage(data.message || data.error || 'Login failed.');
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
				Login
			</Title>
			<form onSubmit={form.onSubmit(handleLogin)}>
				<Stack>
					<TextInput
						label="Email"
						placeholder="you@example.com"
						{...form.getInputProps('email')}
					/>
					<PasswordInput
						label="Password"
						placeholder="Your password"
						{...form.getInputProps('password')}
					/>
					<Button type="submit" fullWidth color="dark">
						Login
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

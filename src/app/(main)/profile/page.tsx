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
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
	const router = useRouter();
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
				value.trim() === ''
					? null
					: value.trim().length < 2
					? 'First name must be at least 2 characters'
					: null,

			lastName: (value) =>
				value.trim() === ''
					? null
					: value.trim().length < 2
					? 'Last name must be at least 2 characters'
					: null,

			email: (value) =>
				value.trim() === ''
					? null
					: /^\S+@\S+$/.test(value)
					? null
					: 'Invalid email',

			password: (value) =>
				value.trim() === ''
					? null
					: value.length < 6
					? 'Password must be at least 6 characters'
					: null,
		},
	});

	useEffect(() => {
		const token = localStorage.getItem('Authorization');
		if (!token) {
			router.push('/login');
		}
	}, [router]);

	const handleUpdate = async (values: typeof form.values) => {
		const token = localStorage.getItem('Authorization');
		if (!token) return;

		const payload: Record<string, string> = {};
		if (values.firstName.trim()) payload.firstName = values.firstName.trim();
		if (values.lastName.trim()) payload.lastName = values.lastName.trim();
		if (values.email.trim()) payload.email = values.email.trim();
		if (values.password.trim()) payload.password = values.password;

		try {
			const resp = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/users/`, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify(payload),
			});

			const data = await resp.json();

			if (resp.ok && data.success) {
				setResponseMessage('Profile updated successfully!');
				setResponseColor('green');
			} else {
				setResponseMessage(data.message || data.error || 'Update failed.');
				setResponseColor('red');
			}
		} catch {
			setResponseMessage('Something went wrong.');
			setResponseColor('red');
		}
	};

	return (
		<Container size="xs" py="xl">
			<Title order={2} mb="lg" ta="center">
				Update Profile
			</Title>

			<form onSubmit={form.onSubmit(handleUpdate)}>
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
						label="New Password"
						placeholder="Leave blank to keep current"
						{...form.getInputProps('password')}
					/>
					<Button type="submit" fullWidth color="dark">
						Update Profile
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

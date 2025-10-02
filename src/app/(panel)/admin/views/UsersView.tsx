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
} from '@mantine/core';

export default function UsersView() {
	const [users, setUsers] = useState<any[]>([]);
	const [opened, setOpened] = useState(false);
	const [editing, setEditing] = useState<any | null>(null);

	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [role, setRole] = useState('');

	useEffect(() => {
		fetchUsers();
	}, []);

	async function fetchUsers() {
		const token = localStorage.getItem('AdminToken');
		const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/users/`, {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		const json = await res.json();
		console.log(json);
		setUsers(json.data);
	}

	async function handleSave() {
		const token = localStorage.getItem('AdminToken');
		const method = editing ? 'PATCH' : 'POST';
		const url = editing
			? `${process.env.NEXT_PUBLIC_API_BASE}/users/${editing.id}`
			: `${process.env.NEXT_PUBLIC_API_BASE}/users`;

		const res = await fetch(url, {
			method,
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify({ name, email, role }),
		});

		if (res.ok) {
			setOpened(false);
			resetForm();
			fetchUsers();
		}
	}

	async function handleDelete(id: number) {
		const token = localStorage.getItem('AdminToken');
		const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/users/${id}`, {
			method: 'DELETE',
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		if (res.ok) fetchUsers();
	}

	function resetForm() {
		setEditing(null);
		setName('');
		setEmail('');
		setRole('');
	}

	return (
		<div>
			<Text size="xl" fw={700} mb="md">
				Users Management
			</Text>
			<Button mb="md" onClick={() => setOpened(true)}>
				Add User
			</Button>
			<Table striped highlightOnHover>
				<Table.Thead>
					<tr>
						<th>ID</th>
						<th>Name</th>
						<th>Email</th>
						<th>Role</th>
						<th>Actions</th>
					</tr>
				</Table.Thead>
				<Table.Tbody>
					{users.map((user) => (
						<tr key={user.id}>
							<td>{user.id}</td>
							<td>
								{user.firstName} {user.lastName}
							</td>
							<td>{user.email}</td>
							<td>{user.role}</td>
							<td>
								<Group gap="xs">
									<Button
										size="xs"
										onClick={() => {
											setEditing(user);
											setName(user.name);
											setEmail(user.email);
											setRole(user.role);
											setOpened(true);
										}}
									>
										Edit
									</Button>
									<Button
										size="xs"
										color="red"
										onClick={() => handleDelete(user.id)}
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
				title={editing ? 'Edit User' : 'Add User'}
			>
				<TextInput
					label="Name"
					value={name}
					onChange={(e) => setName(e.currentTarget.value)}
					mb="md"
				/>
				<TextInput
					label="Email"
					value={email}
					onChange={(e) => setEmail(e.currentTarget.value)}
					mb="md"
				/>
				<Select
					label="Role"
					placeholder="Select role"
					data={[
						{ value: 'admin', label: 'Admin' },
						{ value: 'user', label: 'User' },
					]}
					value={role}
					onChange={setRole}
					mb="md"
				/>
				<Button fullWidth mt="md" onClick={handleSave} color="brown">
					{editing ? 'Update' : 'Create'}
				</Button>
			</Modal>
		</div>
	);
}

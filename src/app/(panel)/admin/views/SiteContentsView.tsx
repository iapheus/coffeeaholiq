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
	Switch,
} from '@mantine/core';

export default function SiteContentsView() {
	const [contents, setContents] = useState<any[]>([]);
	const [opened, setOpened] = useState(false);
	const [editing, setEditing] = useState<any | null>(null);

	const [title, setTitle] = useState('');
	const [type, setType] = useState('');
	const [section, setSection] = useState('');
	const [imageUrl, setImageUrl] = useState('');
	const [linkUrl, setLinkUrl] = useState('');
	const [isActive, setIsActive] = useState(true);

	useEffect(() => {
		fetchContents();
	}, []);

	async function fetchContents() {
		const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/siteContent`);
		const json = await res.json();
		setContents(json.data);
	}

	async function handleSave() {
		const token = localStorage.getItem('AdminToken');
		const method = editing ? 'PUT' : 'POST';
		const url = editing
			? `${process.env.NEXT_PUBLIC_API_BASE}/siteContent/${editing.id}`
			: `${process.env.NEXT_PUBLIC_API_BASE}/siteContent`;

		const res = await fetch(url, {
			method,
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify({
				title,
				type,
				section,
				image_url: imageUrl || null,
				link_url: linkUrl || null,
				is_active: isActive,
			}),
		});

		if (res.ok) {
			setOpened(false);
			resetForm();
			fetchContents();
		}
	}

	async function handleDelete(id: number) {
		const token = localStorage.getItem('AdminToken');
		const res = await fetch(
			`${process.env.NEXT_PUBLIC_API_BASE}/siteContent/${id}`,
			{
				method: 'DELETE',
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}
		);
		if (res.ok) fetchContents();
	}

	function resetForm() {
		setEditing(null);
		setTitle('');
		setType('');
		setSection('');
		setImageUrl('');
		setLinkUrl('');
		setIsActive(true);
	}

	return (
		<div>
			<Text size="xl" fw={700} mb="md">
				Site Content Management
			</Text>
			<Button mb="md" onClick={() => setOpened(true)}>
				Add Content
			</Button>
			<Table striped highlightOnHover>
				<Table.Thead>
					<tr>
						<th>ID</th>
						<th>Title</th>
						<th>Type</th>
						<th>Section</th>
						<th>Active</th>
						<th>Updated</th>
						<th>Actions</th>
					</tr>
				</Table.Thead>
				<Table.Tbody>
					{contents.map((item) => (
						<tr key={item.id}>
							<td>{item.id}</td>
							<td>{item.title}</td>
							<td>{item.type}</td>
							<td>{item.section}</td>
							<td>{item.is_active ? 'Yes' : 'No'}</td>
							<td>{item.updated_at}</td>
							<td>
								<Group gap="xs">
									<Button
										size="xs"
										onClick={() => {
											setEditing(item);
											setTitle(item.title || '');
											setType(item.type || '');
											setSection(item.section || '');
											setImageUrl(item.image_url || '');
											setLinkUrl(item.link_url || '');
											setIsActive(item.is_active ?? true);
											setOpened(true);
										}}
									>
										Edit
									</Button>
									<Button
										size="xs"
										color="red"
										onClick={() => handleDelete(item.id)}
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
				title={editing ? 'Edit Content' : 'Add Content'}
			>
				<TextInput
					label="Title"
					value={title}
					onChange={(e) => setTitle(e.currentTarget.value)}
					mb="md"
				/>
				<Select
					label="Type"
					placeholder="Select type"
					data={[
						{ value: 'text', label: 'Text' },
						{ value: 'image', label: 'Image' },
						{ value: 'video', label: 'Video' },
						{ value: 'link', label: 'Link' },
					]}
					value={type}
					onChange={setType}
					mb="md"
				/>
				<TextInput
					label="Section"
					value={section}
					onChange={(e) => setSection(e.currentTarget.value)}
					mb="md"
				/>
				<TextInput
					label="Image URL"
					value={imageUrl}
					onChange={(e) => setImageUrl(e.currentTarget.value)}
					mb="md"
				/>
				<TextInput
					label="Link URL"
					value={linkUrl}
					onChange={(e) => setLinkUrl(e.currentTarget.value)}
					mb="md"
				/>
				<Switch
					label="Is Active"
					checked={isActive}
					onChange={(e) => setIsActive(e.currentTarget.checked)}
					mb="md"
				/>
				<Button fullWidth mt="md" onClick={handleSave} color="brown">
					{editing ? 'Update' : 'Create'}
				</Button>
			</Modal>
		</div>
	);
}

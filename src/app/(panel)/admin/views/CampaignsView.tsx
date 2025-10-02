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

export default function CampaignsView() {
	const [campaigns, setCampaigns] = useState<any[]>([]);
	const [opened, setOpened] = useState(false);
	const [editing, setEditing] = useState<any | null>(null);
	const [title, setTitle] = useState('');
	const [status, setStatus] = useState('');
	const [startDate, setStartDate] = useState('');
	const [endDate, setEndDate] = useState('');

	useEffect(() => {
		fetchCampaigns();
	}, []);

	async function fetchCampaigns() {
		const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/campaigns`);
		const json = await res.json();
		setCampaigns(json.data);
	}

	async function handleSave() {
		const token = localStorage.getItem('AdminToken');
		const method = editing ? 'PATCH' : 'POST';
		const url = editing
			? `${process.env.NEXT_PUBLIC_API_BASE}/campaigns/${editing.id}`
			: `${process.env.NEXT_PUBLIC_API_BASE}/campaigns`;

		const res = await fetch(url, {
			method,
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify({
				title,
				status,
				start_date: startDate,
				end_date: endDate,
			}),
		});

		if (res.ok) {
			setOpened(false);
			resetForm();
			fetchCampaigns();
		}
	}

	async function handleDelete(id: number) {
		const token = localStorage.getItem('AdminToken');
		const res = await fetch(
			`${process.env.NEXT_PUBLIC_API_BASE}/campaigns/${id}`,
			{
				method: 'DELETE',
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}
		);
		if (res.ok) fetchCampaigns();
	}

	function resetForm() {
		setEditing(null);
		setTitle('');
		setStatus('');
		setStartDate('');
		setEndDate('');
	}

	return (
		<div>
			<Text size="xl" fw={700} mb="md">
				Campaigns Management
			</Text>
			<Button mb="md" onClick={() => setOpened(true)}>
				Add Campaign
			</Button>
			<Table striped highlightOnHover>
				<Table.Thead>
					<tr>
						<th>ID</th>
						<th>Title</th>
						<th>Status</th>
						<th>Start</th>
						<th>End</th>
						<th>Actions</th>
					</tr>
				</Table.Thead>
				<Table.Tbody>
					{campaigns.map((camp) => (
						<tr key={camp.id}>
							<td>{camp.id}</td>
							<td>{camp.title}</td>
							<td>{camp.status}</td>
							<td>{camp.start_date}</td>
							<td>{camp.end_date}</td>
							<td>
								<Group gap="xs">
									<Button
										size="xs"
										onClick={() => {
											setEditing(camp);
											setTitle(camp.title);
											setStatus(camp.status);
											setStartDate(camp.start_date);
											setEndDate(camp.end_date);
											setOpened(true);
										}}
									>
										Edit
									</Button>
									<Button
										size="xs"
										color="red"
										onClick={() => handleDelete(camp.id)}
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
				title={editing ? 'Edit Campaign' : 'Add Campaign'}
			>
				<TextInput
					label="Title"
					value={title}
					onChange={(e) => setTitle(e.currentTarget.value)}
					mb="md"
				/>
				<Select
					label="Status"
					placeholder="Select status"
					data={[
						{ value: 'active', label: 'Active' },
						{ value: 'inactive', label: 'Inactive' },
						{ value: 'scheduled', label: 'Scheduled' },
					]}
					value={status}
					onChange={setStatus}
					mb="md"
				/>
				<TextInput
					label="Start Date"
					placeholder="YYYY-MM-DD"
					value={startDate}
					onChange={(e) => setStartDate(e.currentTarget.value)}
				/>
				<TextInput
					label="End Date"
					placeholder="YYYY-MM-DD"
					value={endDate}
					onChange={(e) => setEndDate(e.currentTarget.value)}
				/>

				<Button fullWidth mt="md" onClick={handleSave} color="brown">
					{editing ? 'Update' : 'Create'}
				</Button>
			</Modal>
		</div>
	);
}

'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from './components/SideBar';
import ReviewsView from './views/ReviewsView';
import UsersView from './views/UsersView';
import ProductsView from './views/ProductsView';
import SiteContentsView from './views/SiteContentsView';
import CampaignsView from './views/CampaignsView';

export default function AdminPage() {
	const router = useRouter();
	const [authorized, setAuthorized] = useState(false);
	const [active, setActive] = useState('Reviews');

	useEffect(() => {
		const token = localStorage.getItem('AdminToken');
		if (token) {
			setAuthorized(true);
			return;
		}

		const email = window.prompt('Email:');
		const password = window.prompt('Password:');

		if (!email || !password) {
			alert('Login informations is missing!');
			router.push('/');
			return;
		}

		fetch(`${process.env.NEXT_PUBLIC_API_BASE}/users/auth/login/admin`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ email, password }),
		})
			.then((res) => {
				return res.json();
			})
			.then((data) => {
				console.log(data);
				if (data.success) {
					localStorage.setItem('AdminToken', data.data);
					setAuthorized(true);
				} else {
					alert('Login failed: ' + data.message);
					router.push('/');
				}
			})
			.catch(() => {
				alert('Server error!');
				router.push('/');
			});
	}, []);

	if (!authorized) return null;

	const renderView = () => {
		switch (active) {
			case 'Reviews':
				return <ReviewsView />;
			case 'Users':
				return <UsersView />;
			case 'Products':
				return <ProductsView />;
			case 'SiteContents':
				return <SiteContentsView />;
			case 'Campaigns':
				return <CampaignsView />;
			default:
				return <div>Select a section</div>;
		}
	};

	return (
		<div>
			<h1 style={{ fontWeight: 'lighter' }}>Coffeeaholiq CMS</h1>
			<div style={{ display: 'flex' }}>
				<Sidebar active={active} setActive={setActive} />
				<div style={{ flex: 1 }}>{renderView()}</div>
			</div>
		</div>
	);
}

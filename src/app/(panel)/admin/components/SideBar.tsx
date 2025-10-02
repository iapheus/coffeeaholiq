'use client';
import { Group, Code } from '@mantine/core';
import { FiLogOut } from 'react-icons/fi';
import { IoMdContacts } from 'react-icons/io';
import classes from '../admin.module.css';

const sections = [
	{ label: 'Users', icon: IoMdContacts },
	{ label: 'SiteContents', icon: IoMdContacts },
	{ label: 'Reviews', icon: IoMdContacts },
	{ label: 'Products', icon: IoMdContacts },
	{ label: 'Campaigns', icon: IoMdContacts },
];

export default function Sidebar({ active, setActive }: any) {
	return (
		<nav className={classes.navbar}>
			<div className={classes.navbarMain}>
				<Group className={classes.header} justify="space-between"></Group>
				{sections.map((item) => (
					<a
						className={classes.link}
						data-active={item.label === active || undefined}
						href="#"
						key={item.label}
						onClick={(e) => {
							e.preventDefault();
							setActive(item.label);
						}}
					>
						<item.icon className={classes.linkIcon} stroke={1.5} />
						<span>{item.label}</span>
					</a>
				))}
			</div>

			<div className={classes.footer}>
				<a
					href="#"
					className={classes.link}
					onClick={(e) => e.preventDefault()}
				>
					<FiLogOut className={classes.linkIcon} />
					<span>Logout</span>
				</a>
			</div>
		</nav>
	);
}

import { ActionIcon, Group } from '@mantine/core';
import { FaYoutube, FaTwitter, FaInstagram } from 'react-icons/fa';
import classes from './Footer.module.css';
import Link from 'next/link';

const links = [
	{ link: '#', label: 'Privacy' },
	{ link: '#', label: 'Contact' },
	{ link: '#', label: 'About Us' },
];

export function Footer() {
	const items = links.map((link) => (
		<Link key={link.label} href={link.link}>
			{link.label}
		</Link>
	));

	return (
		<div className={classes.footer}>
			<div className={classes.inner}>
				<Group className={classes.links}>{items}</Group>
				<p className="text-gray-600">Coffeeaholiq @ 2025</p>
				<Group gap="xs" justify="flex-end" wrap="nowrap">
					<ActionIcon size="lg" variant="default" radius="xl">
						<FaTwitter size={18} />
					</ActionIcon>
					<ActionIcon size="lg" variant="default" radius="xl">
						<FaYoutube size={18} />
					</ActionIcon>
					<ActionIcon size="lg" variant="default" radius="xl">
						<FaInstagram size={18} />
					</ActionIcon>
				</Group>
			</div>
		</div>
	);
}

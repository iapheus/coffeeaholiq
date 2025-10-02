import '@mantine/core/styles.css';
import '@mantine/carousel/styles.css';
import '@mantine/form';
import '@mantine/hooks';

import {
	ColorSchemeScript,
	MantineProvider,
	mantineHtmlProps,
} from '@mantine/core';

import type { Metadata } from 'next';

import './globals.css';
import Navbar from '@/components/Full/Navbar';
import { Footer } from '@/components/Footer/Footer';

export const metadata: Metadata = {
	title: 'Coffeeaholiq - Shop with Taste',
	description: 'Buy some delicious coffee',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" {...mantineHtmlProps}>
			<head>
				<ColorSchemeScript />
			</head>
			<body>
				<MantineProvider>
					<Navbar />
					{children}
					<Footer />
				</MantineProvider>
			</body>
		</html>
	);
}

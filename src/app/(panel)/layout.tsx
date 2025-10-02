import '@mantine/core/styles.css';
import '@mantine/carousel/styles.css';
import '@mantine/form';
import '@mantine/hooks';

import {
	ColorSchemeScript,
	MantineProvider,
	mantineHtmlProps,
} from '@mantine/core';

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en" {...mantineHtmlProps}>
			<head>
				<ColorSchemeScript />
			</head>
			<body>
				<MantineProvider>{children}</MantineProvider>
			</body>
		</html>
	);
}

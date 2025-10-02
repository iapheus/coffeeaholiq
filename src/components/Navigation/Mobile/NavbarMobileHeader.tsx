'use client';
import { ActionIcon } from '@mantine/core';
import Link from 'next/link';
import { IoMdClose } from 'react-icons/io';
import { RxHamburgerMenu } from 'react-icons/rx';
import NavbarMobileCategories from './NavbarMobileCategories';
import INavbarCategory from '@/types/INavbarCategory';
import { useDisclosure } from '@mantine/hooks';
import { useState } from 'react';

export default function NavbarMobileHeader({
	categories,
}: {
	categories: INavbarCategory[];
}) {
	const [opened, { toggle }] = useDisclosure(false);
	const [categoryOpened, setCategoryOpened] = useState<string | null>(null);

	return (
		<>
			<nav className="flex sm:hidden h-16 w-full items-center border-b border-gray-300 px-5">
				{!opened ? (
					<ActionIcon onClick={toggle} variant="transparent" color="dark">
						<RxHamburgerMenu size={48} />
					</ActionIcon>
				) : (
					<ActionIcon onClick={toggle} variant="transparent" color="dark">
						<IoMdClose size={48} />
					</ActionIcon>
				)}
				<Link
					href="/"
					className=" mx-auto text-center text-2xl md:text-4xl font-mono text-black"
				>
					coffeeaholiq
				</Link>
			</nav>
			<NavbarMobileCategories
				categories={categories}
				categoryOpened={categoryOpened}
				setCategoryOpened={setCategoryOpened}
				opened={opened}
			/>
		</>
	);
}

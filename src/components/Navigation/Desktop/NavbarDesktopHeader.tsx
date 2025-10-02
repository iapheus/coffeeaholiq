'use client';
import { ActionIcon, Input, Menu } from '@mantine/core';
import Link from 'next/link';
import { BsCart4, BsPerson } from 'react-icons/bs';
import { IoSearch } from 'react-icons/io5';
import NavbarDesktopCategories from './NavbarDesktopCategories';
import INavbarCategory from '@/types/INavbarCategory';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/app/(main)/stores/authStore';
export default function NavbarDesktopHeader({
	categories,
}: {
	categories: INavbarCategory[];
}) {
	const router = useRouter();
	const [value, setValue] = useState<string>('');
	const { isLoggedIn, checkAuth, logout } = useAuthStore();

	useEffect(() => {
		checkAuth();
	}, []);

	function userLogout(): void {
		logout();
		router.push('/');
	}

	return (
		<nav className="hidden sm:flex w-full flex-col pt-3 border-b border-gray-300">
			<div className="grid grid-cols-3 items-center h-20 px-6">
				<div className="flex justify-start">
					<Input
						className="w-1/2"
						placeholder="Search products..."
						value={value}
						onChange={(e) => setValue(e.currentTarget.value)}
						onKeyDown={(e) => {
							e.key == 'Enter' && router.push(`/search?query=${value}`);
						}}
						size="md"
						rightSectionPointerEvents="all"
						rightSection={
							<Link href={`/search?query=${value}`}>
								<ActionIcon
									variant="transparent"
									size="md"
									aria-label="Search products icon"
									color="brown"
								>
									<IoSearch size={18} />
								</ActionIcon>
							</Link>
						}
					/>
				</div>

				<div className="flex justify-center">
					<Link
						href="/"
						className="text-center text-2xl md:text-4xl font-mono text-black"
					>
						coffeeaholiq
					</Link>
				</div>

				<div className="flex justify-end items-center gap-6 pr-6">
					<ActionIcon
						variant="transparent"
						color="dark"
						size="lg"
						aria-label="Cart"
					>
						<Link href="/cart">
							<BsCart4 size={24} />
						</Link>
					</ActionIcon>

					<Menu shadow="md" width={160} trigger="click-hover">
						<Menu.Target>
							<ActionIcon
								variant="transparent"
								color="dark"
								size="lg"
								aria-label="User menu"
							>
								<BsPerson size={24} />
							</ActionIcon>
						</Menu.Target>

						{isLoggedIn == false ? (
							<Menu.Dropdown>
								{' '}
								<Menu.Item>
									<Link href="/login">Login</Link>
								</Menu.Item>
								<Menu.Item>
									<Link href="/register">Register</Link>
								</Menu.Item>
							</Menu.Dropdown>
						) : (
							<Menu.Dropdown>
								<Menu.Item>
									<Link href="/profile">My Profile</Link>
								</Menu.Item>
								<Menu.Item>
									<Link href="/" onClick={userLogout}>
										Logout
									</Link>
								</Menu.Item>
							</Menu.Dropdown>
						)}
					</Menu>
				</div>
			</div>
			<NavbarDesktopCategories categories={categories} />{' '}
		</nav>
	);
}

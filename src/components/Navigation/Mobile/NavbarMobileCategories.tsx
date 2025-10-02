import { useAuthStore } from '@/app/(main)/stores/authStore';
import INavbarCategory from '@/types/INavbarCategory';
import { ActionIcon, Collapse, Menu } from '@mantine/core';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { BsCart4, BsPerson } from 'react-icons/bs';
import { GoPlus } from 'react-icons/go';
import { RiSubtractFill } from 'react-icons/ri';

interface NavbarMobileCategoriesProps {
	opened: boolean;
	categories: INavbarCategory[];
	setCategoryOpened: (name: string | null) => void;
	categoryOpened: string | null;
}

export default function NavbarMobileCategories({
	opened,
	categories,
	setCategoryOpened,
	categoryOpened,
}: NavbarMobileCategoriesProps) {
	const router = useRouter();
	const { isLoggedIn, checkAuth, logout } = useAuthStore();

	useEffect(() => {
		checkAuth();
	}, []);

	function userLogout(): void {
		logout();
		router.push('/');
	}
	return (
		<Collapse
			className="flex flex-col items-center py-2 gap-5"
			in={opened}
			transitionDuration={200}
		>
			{categories.map((category: { name: string; items: string[] }) => (
				<div key={category.name} className="flex flex-col w-full">
					<div className="flex justify-between items-center w-full px-2">
						<Link
							href={`/category/${category.name
								.toLowerCase()
								.replace(/\s+/g, '-')}`}
							className="text-lg font-semibold"
						>
							{category.name}
						</Link>

						{Array.isArray(category.items) && category.items.length > 0 && (
							<ActionIcon
								onClick={() =>
									setCategoryOpened((prev) =>
										prev === category.name ? null : category.name
									)
								}
								variant="transparent"
								color="dark"
							>
								{categoryOpened === category.name ? (
									<RiSubtractFill />
								) : (
									<GoPlus />
								)}
							</ActionIcon>
						)}
					</div>

					{categoryOpened === category.name &&
						Array.isArray(category.items) &&
						category.items.length > 0 && (
							<div className="pl-4 mt-2 flex flex-col gap-2">
								{category.items.map((item) => (
									<Link
										key={item}
										href={`/category/${item
											.toLowerCase()
											.replace(/\s+/g, '-')}`}
										className="text-sm text-gray-700"
									>
										{item}
									</Link>
								))}
							</div>
						)}
				</div>
			))}
			<div>
				<ActionIcon
					style={{ marginRight: 10 }}
					variant="transparent"
					color="dark"
					size="lg"
					aria-label="Cart"
				>
					<Link href="/cart">
						<BsCart4 size={24} />
					</Link>
				</ActionIcon>

				<Menu shadow="md" width={160}>
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
		</Collapse>
	);
}

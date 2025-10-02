import { Button, Menu } from '@mantine/core';
import INavbarCategory from '@/types/INavbarCategory';
import Link from 'next/link';

export default function NavbarDesktopCategories({
	categories,
}: INavbarCategory[]) {
	return (
		<div className="flex justify-center gap-6">
			{categories.map((category) => (
				<Menu key={category.name} trigger="click-hover" shadow="md" width={150}>
					<Menu.Target>
						<Link
							href={`/category/${category.name
								.toLowerCase()
								.replace(/\s+/g, '-')}`}
						>
							<Button variant="transparent" color="dark">
								{category.name}
							</Button>
						</Link>
					</Menu.Target>
					{category.items.length > 0 && (
						<Menu.Dropdown>
							{category.items.map((item) => (
								<Menu.Item key={item}>
									<Link
										href={`/category/${item
											.toLowerCase()
											.replace(/\s+/g, '-')}`}
									>
										{item}
									</Link>
								</Menu.Item>
							))}
						</Menu.Dropdown>
					)}
				</Menu>
			))}
		</div>
	);
}

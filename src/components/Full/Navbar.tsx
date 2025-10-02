'use server';
import NavbarDesktopHeader from '../Navigation/Desktop/NavbarDesktopHeader';
import NavbarMobileHeader from '../Navigation/Mobile/NavbarMobileHeader';

// I will be fetching on database for this categories data.
const categories = [
	{
		name: 'Coffees',
		items: [
			'Turkish',
			'Espresso',
			'Capsule Coffee',
			'Filter Coffee',
			'Local Coffees',
		],
	},
	{
		name: 'Equipment',
		items: ['French Press', 'Filters', 'Moka Pot'],
	},
	{
		name: 'Chocolates',
		items: [],
	},
	{
		name: 'Accessories',
		items: [],
	},
	{
		name: 'Campaigns',
		items: [],
	},
];

export default async function Navbar() {
	return (
		<>
			<NavbarDesktopHeader categories={categories} />

			<NavbarMobileHeader categories={categories} />
		</>
	);
}

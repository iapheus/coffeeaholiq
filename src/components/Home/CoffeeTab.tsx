'use client';
import { Tabs, rem } from '@mantine/core';
import { useState } from 'react';
import { FaCoffee, FaFlag } from 'react-icons/fa';
import { PiCoffeeBeanFill } from 'react-icons/pi';
import Image from 'next/image';
import Link from 'next/link';
import { coffeeTypes, beanTypes, origins } from '@/data/coffeeData';

export default function CoffeeTab() {
	const [selectedTab, setSelectedTab] = useState<string | null>('coffee');

	const getCards = () => {
		const dataMap = {
			coffee: coffeeTypes,
			bean: beanTypes,
			origin: origins,
		};

		return (
			<div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-2">
				{dataMap[selectedTab!]?.map((item) => (
					<Link key={item.id} href={item.link}>
						<div className="flex flex-col items-center border rounded-lg p-2 hover:shadow-md transition">
							<Image
								src={item.image}
								alt={item.name}
								unoptimized
								loading="lazy"
								width={200}
								height={200}
								className="w-full h-28 object-cover rounded-md"
							/>
							<h3 className="mt-1 text-sm font-medium text-center">
								{item.name}
							</h3>
						</div>
					</Link>
				))}
			</div>
		);
	};

	const tabContent = {
		coffee: (
			<>
				<h2 className="text-lg font-bold mb-2 text-orange-600">Coffee Types</h2>
				<p className="text-sm text-gray-700 leading-relaxed">
					Discover different types of coffee that each bring unique flavors and
					experiences to your cup:
				</p>
				<ul className="list-disc list-inside mt-2 space-y-3">
					<li>
						<strong>Turkish Coffee:</strong> Brewed in a pot with finely ground
						coffee, served with grounds.
					</li>
					<li>
						<strong>Espresso:</strong> A rich, concentrated coffee shot brewed
						under pressure.
					</li>
					<li>
						<strong>Cappuccino:</strong> Equal parts espresso, steamed milk, and
						foam.
					</li>
				</ul>
			</>
		),
		bean: (
			<>
				<h2 className="text-lg font-bold mb-2 text-green-600">Bean Types</h2>
				<p className="text-sm text-gray-700 leading-relaxed">
					Coffee beans vary in flavor, aroma, and strength. Here are some of the
					most popular types:
				</p>
				<ul className="list-disc list-inside mt-2 space-y-3">
					<li>
						<strong>Arabica:</strong> Mild, sweet flavor and smooth finish.
					</li>
					<li>
						<strong>Robusta:</strong> Strong and bold, often found in espresso
						blends.
					</li>
					<li>
						<strong>Liberica:</strong> Floral notes and a distinctive aroma.
					</li>
				</ul>
			</>
		),
		origin: (
			<>
				<h2 className="text-lg font-bold mb-2 text-blue-600">
					Coffee by Origin
				</h2>
				<p className="text-sm text-gray-700 leading-relaxed">
					Coffee grows best in the "Coffee Belt," with each region producing
					distinct flavors:
				</p>
				<ul className="list-disc list-inside mt-2 space-y-3">
					<li>
						<strong>Ethiopia:</strong> Fruity, wine-like flavors.
					</li>
					<li>
						<strong>Colombia:</strong> Balanced and smooth, with caramel notes.
					</li>
					<li>
						<strong>Brazil:</strong> Nutty and chocolatey.
					</li>
				</ul>
			</>
		),
	};

	return (
		<div className="w-full p-4 mt-4">
			<h1 className="text-2xl font-medium text-center text-gray-800 mb-6">
				Which type of coffee do you feel like today?
			</h1>

			<Tabs
				value={selectedTab}
				onChange={setSelectedTab}
				color="orange"
				variant="pills"
				radius="md"
				defaultValue="coffee"
			>
				<Tabs.List grow>
					<Tabs.Tab value="coffee" leftSection={<FaCoffee size={16} />}>
						Coffee Type
					</Tabs.Tab>
					<Tabs.Tab value="bean" leftSection={<PiCoffeeBeanFill size={16} />}>
						Bean Type
					</Tabs.Tab>
					<Tabs.Tab value="origin" leftSection={<FaFlag size={16} />}>
						By Origin
					</Tabs.Tab>
				</Tabs.List>

				<Tabs.Panel value="coffee" pt="md">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div>{getCards()}</div>
						<div className="bg-gray-50 p-4 rounded-lg">{tabContent.coffee}</div>
					</div>
				</Tabs.Panel>

				<Tabs.Panel value="bean" pt="md">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div>{getCards()}</div>
						<div className="bg-gray-50 p-4 rounded-lg">{tabContent.bean}</div>
					</div>
				</Tabs.Panel>

				<Tabs.Panel value="origin" pt="md">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div>{getCards()}</div>
						<div className="bg-gray-50 p-4 rounded-lg">{tabContent.origin}</div>
					</div>
				</Tabs.Panel>
			</Tabs>
		</div>
	);
}

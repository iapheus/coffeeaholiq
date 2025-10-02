import CoffeeTab from '@/components/Home/CoffeeTab';
import HomeCarousel from '@/components/Home/HomeCarousel';
import RecommendedProducts from '@/components/Home/RecommendedProducts';

export default async function Home() {
	return (
		<main className="h-full w-full">
			<div className="w-full mx-auto">
				<HomeCarousel />
			</div>
			<RecommendedProducts />

			<CoffeeTab />
		</main>
	);
}

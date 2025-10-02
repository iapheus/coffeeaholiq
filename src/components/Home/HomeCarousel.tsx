'use client';
import { Carousel } from '@mantine/carousel';
import { useRef } from 'react';
import Autoplay from 'embla-carousel-autoplay';
import Image from 'next/image';
import { QueryClientProvider, useQuery } from '@tanstack/react-query';

import queryClient from '@/tanstack/queryClient';

function HomeCarouselContent() {
	const autoplay = useRef(Autoplay({ delay: 3000 }));

	const { status, data, error } = useQuery({
		queryKey: ['carouselContents'],
		queryFn: async () => {
			const resp = await fetch(
				`${process.env.NEXT_PUBLIC_API_BASE}/siteContent`
			);
			if (!resp.ok) throw new Error('API error');
			const json = await resp.json();
			return json.data.filter((content) => content.section === 'carousel');
		},
		staleTime: 1000 * 60 * 60 * 24,
		refetchOnWindowFocus: false,
	});

	if (status === 'loading') return <div>Loading...</div>;
	if (status === 'error') return <div>Error: {error.message}</div>;

	return (
		<Carousel
			withIndicators
			plugins={[autoplay.current]}
			onMouseEnter={autoplay.current.stop}
			onMouseLeave={() => autoplay.current.play()}
		>
			{data &&
				data.map((item, index) => (
					<Carousel.Slide key={index}>
						<div className="relative w-full h-34 sm:h-48 md:h-52 lg:h-64">
							<h1 className="text-xl md:text-2xl lg:text-4xl text-black z-1 text-center py-14 sm:py-22 md:py-24 lg:py-28">
								{item.title || 'Welcome to Coffeeaholiq!'}
							</h1>
							<Image
								unoptimized
								src={item.image || 'https://placehold.co/1600x400'}
								alt={item.title || `Slide ${index}`}
								fill
								className="blur-xs object-cover rounded-md -z-1"
								priority={index === 0}
							/>
						</div>
					</Carousel.Slide>
				))}
		</Carousel>
	);
}

export default function HomeCarousel() {
	return (
		<QueryClientProvider client={queryClient}>
			<HomeCarouselContent />
		</QueryClientProvider>
	);
}

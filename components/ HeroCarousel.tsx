"use client"

import Image from 'next/image';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader

const heroImage: any = [
    { imgUrl: '/assets/images/hero-1.svg', alt: 'smart-watch' },
    { imgUrl: '/assets/images/hero-2.svg', alt: 'bag' },
    { imgUrl: '/assets/images/hero-3.svg', alt: 'lamp' },
    { imgUrl: '/assets/images/hero-4.svg', alt: 'air fryer' },
    { imgUrl: '/assets/images/hero-5.svg', alt: 'chair' }
]

const HeroCarousel = () => {
    return (
        <div className='hero-carousel'>
            <Carousel showThumbs={false} autoPlay infiniteLoop interval={2000} showArrows={false} showStatus={false}>
            {heroImage.map((image:any) => {
        return (
            <Image className='object-contain' src={image.imgUrl} alt={image.imgUrl} height={484} width={484}  key={image.alt} />
        );
      })}
            </Carousel>
            <Image className='max-xl:hidden absolute -left-[15%] bottom-0 z-0' src="/assets/icons/hand-drawn-arrow.svg" alt="arrow" width={175} height={175} />
        </div>
    )
}

export default HeroCarousel

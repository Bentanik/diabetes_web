"use client";

import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";

const AutoCarousel = ({ images }: { images: string[] }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) =>
                prevIndex === images.length - 1 ? 0 : prevIndex + 1
            );
        }, 3000); // Auto slide every 3 seconds

        return () => clearInterval(interval);
    }, [images.length]);

    const goToPrevious = () => {
        setCurrentIndex(
            currentIndex === 0 ? images.length - 1 : currentIndex - 1
        );
    };

    const goToNext = () => {
        setCurrentIndex(
            currentIndex === images.length - 1 ? 0 : currentIndex + 1
        );
    };

    return (
        <div className="relative w-full h-[600px] object-cover rounded-lg overflow-hidden">
            <div className="relative w-full h-full">
                {images.map((image, index) => (
                    <div
                        key={index}
                        className={`absolute inset-0 transition-opacity duration-500 ${
                            index === currentIndex ? "opacity-100" : "opacity-0"
                        }`}
                    >
                        <Image
                            src={image}
                            alt={`Hospital image ${index + 1}`}
                            fill
                            className="object-cover"
                        />
                    </div>
                ))}
            </div>

            {/* Navigation buttons */}
            <button
                onClick={goToPrevious}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
            >
                <ChevronLeft size={20} />
            </button>
            <button
                onClick={goToNext}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
            >
                <ChevronRight size={20} />
            </button>

            {/* Dots indicator */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {images.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        className={`w-3 h-3 rounded-full transition-all ${
                            index === currentIndex
                                ? "bg-white"
                                : "bg-white bg-opacity-50"
                        }`}
                    />
                ))}
            </div>
        </div>
    );
};

export default AutoCarousel;

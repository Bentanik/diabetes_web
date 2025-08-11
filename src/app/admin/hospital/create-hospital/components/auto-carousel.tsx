/* eslint-disable @next/next/no-img-element */
"use client";

import { BrushCleaning } from "lucide-react";
import React, { useState, useEffect } from "react";

const AutoCarouselMobile = ({
    imagesPreview,
}: {
    imagesPreview?: { id: string; preview: string }[];
}) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [imagesLoaded, setImagesLoaded] = useState(false);

    // Reset currentIndex khi imagesPreview thay đổi
    useEffect(() => {
        setCurrentIndex(0);
        setImagesLoaded(false);

        // Đảm bảo images được load
        if (imagesPreview && imagesPreview.length > 0) {
            const loadPromises = imagesPreview.map((image) => {
                return new Promise((resolve, reject) => {
                    const img = new window.Image();
                    img.onload = resolve;
                    img.onerror = reject;
                    img.src = image.preview;
                });
            });

            Promise.all(loadPromises)
                .then(() => {
                    setImagesLoaded(true);
                })
                .catch(() => {
                    setImagesLoaded(true);
                });
        }
    }, [imagesPreview]);

    // Auto carousel effect
    useEffect(() => {
        if (!imagesLoaded || !imagesPreview || imagesPreview.length <= 1) {
            return;
        }

        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) =>
                prevIndex === imagesPreview.length - 1 ? 0 : prevIndex + 1
            );
        }, 3000);

        return () => clearInterval(interval);
    }, [imagesPreview, imagesLoaded]);

    // Không hiển thị gì nếu không có ảnh
    if (!imagesPreview || imagesPreview.length === 0) {
        return (
            <div>
                <div className="w-full h-[250px] border rounded-2xl mt-4 flex items-center justify-center">
                    <div className="flex gap-2">
                        <BrushCleaning width={20} color="#248FCA" />
                        <span className="font-medium text-[#248FCA]">
                            Không có ảnh
                        </span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="relative w-full h-[250px] object-cover mt-4">
            <div className="relative w-full h-full">
                {imagesPreview.map((image, index) => (
                    <div
                        key={`${image.id}-${index}`} // Đảm bảo key unique
                        className={`absolute inset-0 transition-opacity duration-500 ${
                            index === currentIndex ? "opacity-100" : "opacity-0"
                        }`}
                    >
                        <img
                            src={image.preview}
                            alt={`Hospital image ${index + 1}`}
                            className="object-cover max-h-[250px] w-full h-[250px] rounded-2xl border"
                            loading="eager" // Load ảnh ngay lập tức
                            onLoad={() => {
                                // Force re-render để đảm bảo ảnh hiển thị
                                if (index === 0 && !imagesLoaded) {
                                    setImagesLoaded(true);
                                }
                            }}
                        />
                    </div>
                ))}
            </div>

            {/* Dots indicator */}
            {imagesPreview.length > 1 && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                    {imagesPreview.map((_, index) => (
                        <div
                            key={index}
                            // onClick={() => setCurrentIndex(index)}
                            className={`w-4 h-1 rounded-full transition-all ${
                                index === currentIndex
                                    ? "bg-[#bbb8b8]"
                                    : "bg-[#444444]"
                            }`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default AutoCarouselMobile;

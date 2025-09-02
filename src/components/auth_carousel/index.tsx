"use client";
import { useState, useEffect, useMemo } from "react";
import { MoveLeftIcon, MoveRightIcon } from "lucide-react";
import { auth_slides } from "@/constants/auth";
import { motion } from "framer-motion";
import Image from "next/image";

export default function AuthCarousel() {
    const [index, setIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    useEffect(() => {
        if (isPaused) return;
        const interval = setInterval(() => {
            setIndex((prev) => (prev + 1) % auth_slides.length);
        }, 6000); // Giảm thời gian xuống 6s
        return () => clearInterval(interval);
    }, [isPaused]);

    const prevSlide = () => {
        setIndex(
            (prev) => (prev - 1 + auth_slides.length) % auth_slides.length
        );
    };

    const nextSlide = () => {
        setIndex((prev) => (prev + 1) % auth_slides.length);
    };

    const slides = useMemo(() => auth_slides, []);

    return (
        <div
            className="relative w-full h-full font-be-vietnam-pro overflow-hidden will-change-transform"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            <div className="relative w-full h-full">
                {slides.map((slide, i) => (
                    <motion.div
                        key={i}
                        className="absolute inset-0 w-full h-full"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: index === i ? 1 : 0 }}
                        transition={{ duration: 0.8, ease: "easeInOut" }} // Giảm thời gian
                        style={{ pointerEvents: index === i ? "auto" : "none" }}
                    >
                        <Image
                            src={slide.img}
                            alt={`Slide ${i + 1}`}
                            className="absolute inset-0 w-full h-full object-cover will-change-transform"
                            fill={true}
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-black/70"></div>
                        <motion.div
                            className="absolute bottom-20 left-10 text-white px-6 py-4"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{
                                opacity: index === i ? 1 : 0,
                                y: index === i ? 0 : 10,
                            }}
                            transition={{
                                duration: 0.6,
                                ease: "easeOut",
                                delay: 0.2,
                            }}
                        >
                            <p className="text-[2.8rem] font-bold">
                                {slide.text}
                            </p>
                        </motion.div>
                    </motion.div>
                ))}
            </div>

            <div className="absolute bottom-6 right-6 flex gap-x-4">
                <motion.button
                    className="w-12 h-12 bg-white/20 hover:bg-white/30 text-white flex items-center justify-center rounded-full shadow-md transition duration-300 backdrop-blur-md"
                    onClick={prevSlide}
                    whileHover={{ scale: 1.05 }}
                >
                    <MoveLeftIcon className="w-6 h-6" />
                </motion.button>
                <motion.button
                    className="w-12 h-12 bg-white/20 hover:bg-white/30 text-white flex items-center justify-center rounded-full shadow-md transition duration-300 backdrop-blur-md"
                    onClick={nextSlide}
                    whileHover={{ scale: 1.05 }}
                >
                    <MoveRightIcon className="w-6 h-6" />
                </motion.button>
            </div>
        </div>
    );
}

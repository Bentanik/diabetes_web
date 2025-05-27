'use client'

import React from 'react'
import { motion } from "framer-motion";
import { Button } from '@/components/ui/button';
import { HEADER_NAVIGATIONS } from '@/constants/home';
import Link from 'next/link';
import Image from 'next/image';


const renderHeaderNavigations = () => {
    return HEADER_NAVIGATIONS.map((nav, index) => (
        <li key={index}>
            <Link href
                ={nav.href}
                className="hover:text-[#248fca] cursor-pointer"
            >
                {nav.title}
            </Link>
        </li >
    ))
}

export default function Header() {
    return (
        <motion.header
            className="fixed top-0 left-0 w-full bg-white px-6 md:px-[66px] h-[80px] flex items-center justify-between z-50 font-be-vietnam-pro"
            initial="visible"
            // animate={hidden === null ? "hidden" : "visible"}
            exit="hidden"
            transition={{ duration: 0.5, ease: "easeOut" }}
            variants={{
                visible: { y: 0, opacity: 1 },
                hidden: { y: -80, opacity: 0 },
            }}
        >
            {/* Logo & Navbar */}
            <section className="flex items-center gap-8 md:gap-[103px]">
                {/* Logo */}
                <div>
                    <Link href="/" className="flex items-center gap-2">
                        <Image
                            src="/images/logo_icon1.png"
                            alt="DbDoctor Logo"
                            width={60}
                            height={60}
                        />
                        <h1 className="text-2xl font-bold text-[#248fca]">DbDoctor</h1>
                    </Link>
                </div>

                {/* Navbar */}
                <nav className="hidden md:flex">
                    <ul className="flex items-center gap-x-6 text-gray-700 font-medium text-sm">
                        {renderHeaderNavigations()}
                    </ul>
                </nav>
            </section>

            {/* Search & Buttons */}
            <section className="flex items-center gap-x-9">

                {/* Apply Button */}
                <Button type="button" className="hidden md:block px-5 py-2 text-sm font-medium bg-[#248fca] text-white hover:bg-[#2485ca] cursor-pointer">
                    Đăng nhập
                </Button>

                {/* Login / Avatar */}
                {/* <div>
            <ProfileMenu profile={userInfo} />
          </div> */}
            </section>
        </motion.header>
    )
}

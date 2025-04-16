'use client'
import React, { useState } from "react";
import Globe from "./icons/Globe";
import Chevron from "./icons/Chevron";
import USFlagIcon from "./icons/flags/USFlagIcon";
import FrenchFlagIcon from "./icons/flags/FrenchFlagIcon";
import SpanishFlagIcon from "./icons/flags/SpanishFlagIcon";
import { Locale } from "../lib/dictionaries";
import { usePathname, useRouter } from "next/navigation";

const localeCodeToName: Record<Locale, string> = {
    "en": "English",
    "es": "Español",
    "fr": "Français",
}

export default function LocalizationButton() {
    const [isOpen, setIsOpen] = useState(false);

    const pathSegments = usePathname().split("/");
    const router = useRouter();


    const toggleDropDown = () => { 
        setIsOpen(!isOpen);
    };

    const selectLanguage = (selectedLanguage: Locale) => {
        router.push(`/${selectedLanguage}/${pathSegments.slice(2).join('/')}`);
    };

    return (
        <div className="relative inline-block">
            {isOpen && (
                <div className="absolute right-0 bottom-full mb-2 w-40 bg-white shadow-lg rounded-md z-10">
                    <div
                        onClick={() => selectLanguage("en")}
                        className="flex items-center px-2 py-2 text-gray-800 hover:bg-gray-200 cursor-pointer space-x-2"
                    >
                        <USFlagIcon width={35} height={25} />
                        <span>English</span>
                    </div>
                    <div
                        onClick={() => selectLanguage("es")}
                        className="flex items-center px-2 py-2 text-gray-800 hover:bg-gray-200 cursor-pointer"
                    >
                        <SpanishFlagIcon width={45} height={35} />
                        <span>Español</span>
                    </div>
                    <div
                        onClick={() => selectLanguage("fr")}
                        className="flex items-center px-2 py-2 text-gray-800 hover:bg-gray-200 cursor-pointer space-x-2"
                    >
                        <FrenchFlagIcon width={35} height={22} />
                        <span>Français</span>
                    </div>
                </div>
            )}
            <button 
                onClick={toggleDropDown}
                className="flex items-center bg-orange-light text-white px-4 py-2 rounded-lg space-x-2"
            >
                <Globe />
                <span>{localeCodeToName[pathSegments[1] as Locale]}</span>
                <div  className="transform scale-y-[-1]">
                    <Chevron />
                </div>
            </button>
        </div>
    );
}
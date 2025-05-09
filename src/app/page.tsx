/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import { collection, doc, getDoc, setDoc } from "firebase/firestore";
import { useUser } from "@clerk/nextjs";
import { db } from "../../firebase";
import Link from "next/link";
import { useTranslation, preloadTranslations } from "@/i18n"; // Note the additional preloadTranslations import
import TranslatedText from "@/components/TranslatedText";
import Loading from "./components/Loading";

export default function HomePage() {
  const { user, isLoaded, isSignedIn } = useUser();
  const { t, locale, isLoaded: isTranslationLoaded } = useTranslation();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [translations, setTranslations] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);

  // Update: Preload translations for the current locale before calling t(...)
  useEffect(() => {
    if (!isTranslationLoaded) return; // Wait for translations to load
    const loadTranslations = async () => {
      setIsLoading(true);
      // Wait for the translation file for the current locale to be preloaded
      await preloadTranslations([locale]);

      const keys = [
        "app.title",
        "app.description",
        "app.getStarted",
        "app.signUp",
        "app.learnMore",
      ];

      const translatedTexts: Record<string, string> = {};
      for (const key of keys) {
        translatedTexts[key] = await t(key);
      }

      setTranslations(translatedTexts);
      setIsLoading(false);
    };

    loadTranslations();
  }, [locale, isTranslationLoaded]);

  const createUser = async () => {
    try {
      if (!user || !user.id) {
        console.error("Cannot create user: User or user ID is undefined");
        return;
      }

      console.log("Attempting to create/verify user with ID:", user.id);
      const collectionRef = collection(db, "users");
      const docRef = doc(collectionRef, user.id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        console.log("User already exists in db with ID:", user.id);
      } else {
        console.log("Creating new user in db with ID:", user.id);
        const userData = {
          firstName: user.firstName,
          lastName: user.lastName,
          createdAt: new Date().toISOString(),
          email: user.primaryEmailAddress?.emailAddress,
          isActive: false,
          location: "",
          day: "",
          time: "",
          hasTransport: "",
          dietary: "",
          hasKitchen: "",
          services: "",
          canSomeonePickUp: "",
          language: locale, // Use the selected language
        };
        console.log("User data being saved:", userData);
        await setDoc(docRef, userData);
        console.log("User successfully created in db");
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error("Error adding user to db:", message);
    }
  };

  useEffect(() => {
    if (isSignedIn && isLoaded && user) {
      console.log("User is signed in, loaded, and available. Creating user...");
      createUser();
    } else if (!isSignedIn && isLoaded) {
      console.log("User is not signed in but loading is complete");
    } else if (!isLoaded) {
      console.log("User data is still loading");
    }
  }, [isSignedIn, isLoaded, user]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <main className="min-h-screen flex flex-col items-center  bg-[#E8F5E9] text-center p-8">
      <div className="flex flex-col items-center max-w-3xl">
        <Image
          src="/capital_area_food_chat.png"
          alt="Capital Area Food Chat Logo"
          width={600}
          height={600}
          priority
        />

        <h1 className="text-3xl text-black font-bold mb-3">
          <TranslatedText key={`app.title-${locale}`} textKey="app.title" />
        </h1>

        <p className="text-lg text-gray-600 mb-5">
          <TranslatedText textKey="app.description" />
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
          <SignedIn>
            <Link
              href="/survey"
              className="bg-green-600 text-white px-6 py-2 rounded-full hover:bg-green-700 transition"
            >
              <TranslatedText textKey="app.getStarted" />
            </Link>
          </SignedIn>

          <SignedOut>
            <Link
              href="/sign-up"
              className="bg-green-600 text-white px-6 py-2 rounded-full hover:bg-green-700 transition"
            >
              <TranslatedText textKey="app.signUp" />
            </Link>
          </SignedOut>
          <button className="border border-green-600 text-green-600 px-6 py-2 rounded-full hover:bg-green-100 transition">
            <Link href={"https://www.capitalareafoodbank.org/"} target="_blank"><TranslatedText textKey="app.learnMore" /></Link>
          </button>
        </div>
      </div>
    </main>
  );
}

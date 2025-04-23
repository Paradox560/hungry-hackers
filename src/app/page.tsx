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

export default function HomePage() {
  const { user, isLoaded, isSignedIn } = useUser();
  const { t, locale, isLoaded: isTranslationLoaded } = useTranslation();
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
          email: user.primaryEmailAddress?.emailAddress,
          ingredients: {},
          isActive: false,
          schedule: {
            monday: { start: "", end: "" },
            tuesday: { start: "", end: "" },
            wednesday: { start: "", end: "" },
            thursday: { start: "", end: "" },
            friday: { start: "", end: "" },
            saturday: { start: "", end: "" },
            sunday: { start: "", end: "" },
          },
          location: "Not set",
          dietaryRestrictions: {},
          language: locale, // Use the selected language
          culturalBackground: "Not set",
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
    return <div className="p-6 text-center">Loading...</div>;
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-white text-center p-8">
      <Image
        src="/cafb-logo.png"
        alt="Capital Area Food Chat Logo"
        width={160}
        height={160}
        style={{ marginBottom: "1.5rem" }}
      />

      <h1 className="text-3xl text-black font-bold mb-4">
        {/* By adding a key using the locale, we force this TranslatedText to remount when locale changes */}
        <TranslatedText key={`app.title-${locale}`} textKey="app.title" />
      </h1>

      <>
        <p className="text-lg text-gray-600 mb-6">
          <TranslatedText textKey="app.description" />
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
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
            <TranslatedText textKey="app.learnMore" />
          </button>
        </div>
      </>
    </main>
  );
}

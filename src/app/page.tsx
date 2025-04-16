"use client";

import { useEffect, useState } from "react";
// import Chatbot from "@/app/components/Chatbot";
import Image from "next/image";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import { collection, doc, getDoc, setDoc } from "firebase/firestore";
import { useUser } from "@clerk/nextjs";
import { db } from "../../firebase";
import Link from "next/link";

export default function HomePage() {
  // const [showChatbot, setShowChatbot] = useState(false);
  const { user, isLoaded, isSignedIn } = useUser();

  const createUser = async () => {
    try {
      if (!user || !user.id) {
        console.error("Cannot create user: User or user ID is undefined");
        return;
      }

      console.log("Attempting to create/verify user with ID:", user.id);
      const collectionRef = collection(db, 'users');
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
          language: "en",
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

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-white text-center p-8">
      <Image
        src="/cafb-logo.png"
        alt="Capital Area Food Chat Logo"
        width={160}
        height={160}
        style={{ marginBottom: "1.5rem" }}
      />

      <h1 className="text-3xl font-bold mb-4">Get Food Support Near You</h1>

      (
        <>
          <p className="text-lg text-gray-600 mb-6">
            Chat with our AI helper and find nearby food assistance.
          </p>

            <div className="flex flex-col sm:flex-row gap-4">
            <SignedIn>
              <button
                className="bg-green-600 text-white px-6 py-2 rounded-full hover:bg-green-700 transition"
              >
                <Link href="/survey">Get Started</Link>
              </button>
            </SignedIn>
      
            <SignedOut>
              <button
                className="bg-green-600 text-white px-6 py-2 rounded-full hover:bg-green-700 transition"
                >
                  <Link href="/sign-up">Sign up to Get Started</Link>
              </button>
            </SignedOut>
            <button className="border border-green-600 text-green-600 px-6 py-2 rounded-full hover:bg-green-100 transition">
              Learn More
            </button>
          </div>
        </>
      )
    </main>
  );
}

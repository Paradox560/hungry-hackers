"use client";

import { SignedOut, SignedIn, UserButton, useUser } from "@clerk/nextjs";
import { collection, doc, getDoc, setDoc } from "firebase/firestore";
import { useEffect } from "react";
import { Button } from "@mui/material";
import { db } from "../../firebase";

export default function Home() {
  const { user, isLoaded, isSignedIn } = useUser();

  const createUser = async () => {
    try {
      if (!user || !user.id) {
        console.error("Cannot create user: User or user ID is undefined");
        return;
      }

      const collectionRef = collection(db, 'users');
      const docRef = doc(collectionRef, user.id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        console.log("User already exists in db with ID:", user.id);
      } else {
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
        await setDoc(docRef, userData);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error("Error adding user to db:", message);
    }
  };

  useEffect(() => {
    if (isSignedIn && isLoaded && user) {
      createUser();
    } else if (!isSignedIn && isLoaded) {
      console.log("User is not signed in but loading is complete");
    } else if (!isLoaded) {
      console.log("User data is still loading");
    }
  }, [isSignedIn, isLoaded, user]);

  return (
    <div
      style={{ backgroundColor: "#860F09" }}
      className="min-h-screen full-width"
    >
      <h1
        style={{ color: "#FDEDD6", borderBottom: "0.15rem solid white" }}
        className="text-8xl pt-8 ml-7 w-fit"
      >
        Welcome to Capital Area Food Chat
      </h1>
      <h2 style={{ color: "#FDEDD6" }} className="text-5xl ml-10 mt-3">
        Your Place to Get the Food
      </h2>

      <SignedIn>
        <UserButton afterSignOutUrl="/" />
        <Button
          href="/home"
          style={{
            backgroundColor: "#B37238",
            color: "#FDEDD6",
            fontSize: 24,
            fontWeight: 400,
          }}
          className="ml-[3%] mt-[6%] w-44 h-18"
          variant="contained"
        >
          Home
        </Button>
      </SignedIn>
      <SignedOut>
        <p
          style={{ color: "#FDEDD6", fontWeight: 300 }}
          className="text-2xl ml-[3%] mt-[5%] w-3/5"
        >
          Capital Area Food Chat does something. Log in with the button below!
        </p>
        <Button
          href="/sign-in"
          style={{
            backgroundColor: "#B37238",
            color: "#FDEDD6",
            fontSize: 24,
            fontWeight: 400,
          }}
          className="ml-[3%] mt-[6%] w-44 h-18"
          variant="contained"
        >
          Log In
        </Button>
      </SignedOut>
    </div>
  );
}

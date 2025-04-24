"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/solid";
import { useTranslation } from "@/i18n";
import TranslatedText from "@/components/TranslatedText";
import Loading from "../components/Loading";
import { useUser } from "@clerk/nextjs";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../firebase";

interface UserAnswers {
  location: string;
  day: string;
  time: string;
  hasTransport: string;
  dietary: string;
  hasKitchen: string;
  services: string;
  canSomeonePickup: string;
}

export default function Chatbot() {
  const { user, isLoaded: isUserLoaded } = useUser();
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState<UserAnswers>({
    location: "",
    day: "",
    time: "",
    hasTransport: "",
    dietary: "",
    hasKitchen: "",
    services: "",
    canSomeonePickup: "",
  });
  const [translations, setTranslations] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const { t, locale, isLoaded } = useTranslation();
  const [userDataFetched, setUserDataFetched] = useState(false);

  // Fetch user data from Firebase
  useEffect(() => {
    const fetchUserData = async () => {
      if (!isUserLoaded || !user || !user.id) return;

      try {
        const userDocRef = doc(db, "users", user.id);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          setAnswers({
            location: userData.location || "",
            day: userData.day || "",
            time: userData.time || "",
            hasTransport: userData.hasTransport || "",
            dietary: userData.dietary || "",
            hasKitchen: userData.hasKitchen || "",
            services: userData.services || "",
            canSomeonePickup: userData.canSomeonePickUp || "",
          });
        }
        setUserDataFetched(true);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setUserDataFetched(true);
      }
    };

    fetchUserData();
  }, [isUserLoaded, user]);

  // Update Firebase when answers change
  useEffect(() => {
    const updateUserData = async () => {
      if (!isUserLoaded || !user || !user.id || !userDataFetched) return;

      try {
        const userDocRef = doc(db, "users", user.id);
        await updateDoc(userDocRef, {
          location: answers.location,
          day: answers.day,
          time: answers.time,
          hasTransport: answers.hasTransport,
          dietary: answers.dietary,
          hasKitchen: answers.hasKitchen,
          services: answers.services,
          canSomeonePickUp: answers.canSomeonePickup,
        });
      } catch (error) {
        console.error("Error updating user data:", error);
      }
    };

    // Debounce update to avoid too many writes
    const debounceTimer = setTimeout(() => {
      if (userDataFetched) {
        updateUserData();
      }
    }, 1000);

    return () => clearTimeout(debounceTimer);
  }, [answers, isUserLoaded, user, userDataFetched]);

  // Load all translations needed for this page
  useEffect(() => {
    if (!isLoaded) return; // Wait for translations to load
    const loadAllTranslations = async () => {
      setIsLoading(true);
      const keys = [
        "survey.title",
        "survey.description",
        "survey.progress",
        "survey.complete",
        "survey.next",
        "survey.back",
        "survey.findPantries",
        "survey.steps.location.title",
        "survey.steps.location.question",
        "survey.steps.location.placeholder",
        "survey.steps.date.title",
        "survey.steps.date.question",
        "survey.steps.date.placeholder",
        "survey.steps.time.title",
        "survey.steps.time.question",
        "survey.steps.time.placeholder",
        "survey.steps.transport.title",
        "survey.steps.transport.question",
        "survey.steps.transport.selectOption",
        "survey.steps.transport.hasTransport",
        "survey.steps.transport.noTransport",
        "survey.steps.transport.limitedTransport",
        "survey.steps.diet.title",
        "survey.steps.diet.question",
        "survey.steps.diet.placeholder",
        "survey.steps.kitchen.title",
        "survey.steps.kitchen.question",
        "survey.steps.kitchen.selectOption",
        "survey.steps.kitchen.fullAccess",
        "survey.steps.kitchen.limitedAccess",
        "survey.steps.kitchen.noAccess",
        "survey.steps.services.title",
        "survey.steps.services.question",
        "survey.steps.services.placeholder",
        "survey.steps.pickup.title",
        "survey.steps.pickup.question",
        "survey.steps.pickup.selectOption",
        "survey.steps.pickup.canPickup",
        "survey.steps.pickup.cannotPickup",
        "survey.steps.pickup.maybePickup",
        "survey.completion.title",
        "survey.completion.description",
      ];

      const translatedTexts: Record<string, string> = {};
      for (const key of keys) {
        translatedTexts[key] = await t(key);
      }

      setTranslations(translatedTexts);
      setIsLoading(false);
    };

    loadAllTranslations();
    // Re-run the effect whenever the locale changes.
  }, [locale, isLoaded]);

  const handleNext = () => setStep(step + 1);
  const handlePrevious = () => setStep(Math.max(1, step - 1));

  const totalSteps = 8;
  const progress = (step / totalSteps) * 100;

  // Function to get placeholder text based on user data
  const getPlaceholder = (field: keyof UserAnswers, defaultText: string) => {
    return answers[field] ? answers[field] : defaultText;
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-[#E8F5E9] py-12 px-4">
      <div className="max-w-2xl mx-auto bg-white shadow-md rounded-lg overflow-hidden border border-gray-100">
        {/* Page header */}
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 px-6 py-4 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900">
            <TranslatedText
              textKey="survey.title"
              params={{ current: step, total: totalSteps }}
            />
          </h1>
          <p className="text-gray-700 text-sm mt-1">
            <TranslatedText
              textKey="survey.description"
              params={{ current: step, total: totalSteps }}
            />
          </p>
        </div>

        <div className="p-6">
          {/* Progress indicator */}
          <div className="mb-8">
            <div className="flex justify-between text-sm text-gray-800 mb-2">
              <TranslatedText
                textKey="survey.progress"
                params={{ current: step, total: totalSteps }}
              />
              <TranslatedText
                textKey="survey.complete"
                params={{ percentage: Math.round(progress) }}
              />
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
                aria-valuenow={progress}
                aria-valuemin={0}
                aria-valuemax={100}
                role="progressbar"
              ></div>
            </div>
          </div>

          {step === 1 && (
            <div className="transition-all duration-300 animate-fadeIn">
              <h2 className="text-xl font-semibold mb-4 text-gray-900">
                {translations["survey.steps.location.title"]}
              </h2>
              <label htmlFor="location" className="block text-gray-800 mb-2">
                {translations["survey.steps.location.question"]}
              </label>
              <input
                id="location"
                type="text"
                value={answers.location}
                onChange={(e) =>
                  setAnswers({ ...answers, location: e.target.value })
                }
                className="border border-gray-300 placeholder-gray-500 px-4 py-2 w-full mb-6 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                placeholder={translations["survey.steps.location.placeholder"]}
                aria-required="true"
              />
              <div className="flex justify-end">
                <button
                  onClick={handleNext}
                  className="bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-300 text-white px-6 py-2 rounded-md flex items-center gap-2 transition-colors focus:outline-none"
                  aria-label="Next question"
                >
                  {translations["survey.next"]}{" "}
                  <ArrowRightIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="transition-all duration-300 animate-fadeIn">
              <h2 className="text-xl font-semibold mb-4 text-gray-900">
                {translations["survey.steps.date.title"]}
              </h2>
              <label htmlFor="day" className="block text-gray-800 mb-2">
                {translations["survey.steps.date.question"]}
              </label>
              <input
                id="day"
                type="text"
                placeholder={translations["survey.steps.date.placeholder"]}
                value={answers.day}
                onChange={(e) =>
                  setAnswers({ ...answers, day: e.target.value })
                }
                className="border border-gray-300 placeholder-gray-500 px-4 py-2 w-full mb-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                aria-required="true"
              />
              <div className="flex justify-between">
                <button
                  onClick={handlePrevious}
                  className="border border-gray-300 hover:bg-gray-100 text-gray-800 px-6 py-2 rounded-md flex items-center gap-2 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300"
                  aria-label="Previous question"
                >
                  <ArrowLeftIcon className="h-4 w-4" />{" "}
                  {translations["survey.back"]}
                </button>
                <button
                  onClick={handleNext}
                  className="bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-300 text-white px-6 py-2 rounded-md flex items-center gap-2 transition-colors focus:outline-none"
                  aria-label="Next question"
                >
                  {translations["survey.next"]}{" "}
                  <ArrowRightIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="transition-all duration-300 animate-fadeIn">
              <h2 className="text-xl font-semibold mb-4 text-gray-900">
                {translations["survey.steps.time.title"]}
              </h2>
              <label htmlFor="time" className="block text-gray-800 mb-2">
                {translations["survey.steps.time.question"]}
              </label>
              <input
                id="time"
                type="text"
                placeholder={translations["survey.steps.time.placeholder"]}
                value={answers.time}
                onChange={(e) =>
                  setAnswers({ ...answers, time: e.target.value })
                }
                className="border border-gray-300 placeholder-gray-500 px-4 py-2 w-full mb-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                aria-required="true"
              />
              <div className="flex justify-between">
                <button
                  onClick={handlePrevious}
                  className="border border-gray-300 hover:bg-gray-100 text-gray-800 px-6 py-2 rounded-md flex items-center gap-2 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300"
                  aria-label="Previous question"
                >
                  <ArrowLeftIcon className="h-4 w-4" />{" "}
                  {translations["survey.back"]}
                </button>
                <button
                  onClick={handleNext}
                  className="bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-300 text-white px-6 py-2 rounded-md flex items-center gap-2 transition-colors focus:outline-none"
                  aria-label="Next question"
                >
                  {translations["survey.next"]}{" "}
                  <ArrowRightIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="transition-all duration-300 animate-fadeIn">
              <h2 className="text-xl font-semibold mb-4 text-gray-900">
                {translations["survey.steps.transport.title"]}
              </h2>
              <label htmlFor="transport" className="block text-gray-800 mb-2">
                {translations["survey.steps.transport.question"]}
              </label>
              <select
                id="transport"
                value={answers.hasTransport}
                onChange={(e) =>
                  setAnswers({ ...answers, hasTransport: e.target.value })
                }
                className="border border-gray-300 px-4 py-2 w-full mb-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 font-medium"
                aria-required="true"
              >
                <option value="" className="text-gray-900">
                  {translations["survey.steps.transport.selectOption"]}
                </option>
                <option value="yes" className="text-gray-900">
                  {translations["survey.steps.transport.hasTransport"]}
                </option>
                <option value="no" className="text-gray-900">
                  {translations["survey.steps.transport.noTransport"]}
                </option>
                <option value="limited" className="text-gray-900">
                  {translations["survey.steps.transport.limitedTransport"]}
                </option>
              </select>
              <div className="flex justify-between">
                <button
                  onClick={handlePrevious}
                  className="border border-gray-300 hover:bg-gray-100 text-gray-800 px-6 py-2 rounded-md flex items-center gap-2 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300"
                  aria-label="Previous question"
                >
                  <ArrowLeftIcon className="h-4 w-4" />{" "}
                  {translations["survey.back"]}
                </button>
                <button
                  onClick={handleNext}
                  className="bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-300 text-white px-6 py-2 rounded-md flex items-center gap-2 transition-colors focus:outline-none"
                  aria-label="Next question"
                >
                  {translations["survey.next"]}{" "}
                  <ArrowRightIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="transition-all duration-300 animate-fadeIn">
              <h2 className="text-xl font-semibold mb-4 text-gray-900">
                {translations["survey.steps.diet.title"]}
              </h2>
              <label htmlFor="dietary" className="block text-gray-800 mb-2">
                {translations["survey.steps.diet.question"]}
              </label>
              <input
                id="dietary"
                type="text"
                placeholder={translations["survey.steps.diet.placeholder"]}
                value={answers.dietary}
                onChange={(e) =>
                  setAnswers({ ...answers, dietary: e.target.value })
                }
                className="border border-gray-300 placeholder-gray-500 px-4 py-2 w-full mb-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              />
              <div className="flex justify-between">
                <button
                  onClick={handlePrevious}
                  className="border border-gray-300 hover:bg-gray-100 text-gray-800 px-6 py-2 rounded-md flex items-center gap-2 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300"
                  aria-label="Previous question"
                >
                  <ArrowLeftIcon className="h-4 w-4" />{" "}
                  {translations["survey.back"]}
                </button>
                <button
                  onClick={handleNext}
                  className="bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-300 text-white px-6 py-2 rounded-md flex items-center gap-2 transition-colors focus:outline-none"
                  aria-label="Next question"
                >
                  {translations["survey.next"]}{" "}
                  <ArrowRightIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {step === 6 && (
            <div className="transition-all duration-300 animate-fadeIn">
              <h2 className="text-xl font-semibold mb-4 text-gray-900">
                {translations["survey.steps.kitchen.title"]}
              </h2>
              <label htmlFor="kitchen" className="block text-gray-800 mb-2">
                {translations["survey.steps.kitchen.question"]}
              </label>
              <select
                id="kitchen"
                value={answers.hasKitchen}
                onChange={(e) =>
                  setAnswers({ ...answers, hasKitchen: e.target.value })
                }
                className="border border-gray-300 px-4 py-2 w-full mb-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 font-medium"
                aria-required="true"
              >
                <option value="" className="text-gray-900">
                  {translations["survey.steps.kitchen.selectOption"]}
                </option>
                <option value="yes" className="text-gray-900">
                  {translations["survey.steps.kitchen.fullAccess"]}
                </option>
                <option value="limited" className="text-gray-900">
                  {translations["survey.steps.kitchen.limitedAccess"]}
                </option>
                <option value="no" className="text-gray-900">
                  {translations["survey.steps.kitchen.noAccess"]}
                </option>
              </select>
              <div className="flex justify-between">
                <button
                  onClick={handlePrevious}
                  className="border border-gray-300 hover:bg-gray-100 text-gray-800 px-6 py-2 rounded-md flex items-center gap-2 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300"
                  aria-label="Previous question"
                >
                  <ArrowLeftIcon className="h-4 w-4" />{" "}
                  {translations["survey.back"]}
                </button>
                <button
                  onClick={handleNext}
                  className="bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-300 text-white px-6 py-2 rounded-md flex items-center gap-2 transition-colors focus:outline-none"
                  aria-label="Next question"
                >
                  {translations["survey.next"]}{" "}
                  <ArrowRightIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {step === 7 && (
            <div className="transition-all duration-300 animate-fadeIn">
              <h2 className="text-xl font-semibold mb-4 text-gray-900">
                {translations["survey.steps.services.title"]}
              </h2>
              <label htmlFor="services" className="block text-gray-800 mb-2">
                {translations["survey.steps.services.question"]}
              </label>
              <textarea
                id="services"
                placeholder={translations["survey.steps.services.placeholder"]}
                value={answers.services}
                onChange={(e) =>
                  setAnswers({ ...answers, services: e.target.value })
                }
                className="border border-gray-300 placeholder-gray-500 px-4 py-2 w-full mb-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                rows={3}
              />
              <div className="flex justify-between">
                <button
                  onClick={handlePrevious}
                  className="border border-gray-300 hover:bg-gray-100 text-gray-800 px-6 py-2 rounded-md flex items-center gap-2 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300"
                  aria-label="Previous question"
                >
                  <ArrowLeftIcon className="h-4 w-4" />{" "}
                  {translations["survey.back"]}
                </button>
                <button
                  onClick={handleNext}
                  className="bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-300 text-white px-6 py-2 rounded-md flex items-center gap-2 transition-colors focus:outline-none"
                  aria-label="Next question"
                >
                  {translations["survey.next"]}{" "}
                  <ArrowRightIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {step === 8 && (
            <div className="transition-all duration-300 animate-fadeIn">
              <h2 className="text-xl font-semibold mb-4 text-gray-900">
                {translations["survey.steps.pickup.title"]}
              </h2>
              <label htmlFor="pickup" className="block text-gray-800 mb-2">
                {translations["survey.steps.pickup.question"]}
              </label>
              <select
                id="pickup"
                value={answers.canSomeonePickup}
                onChange={(e) =>
                  setAnswers({ ...answers, canSomeonePickup: e.target.value })
                }
                className="border border-gray-300 px-4 py-2 w-full mb-6 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 font-medium"
                aria-required="true"
              >
                <option value="" className="text-gray-900">
                  {translations["survey.steps.pickup.selectOption"]}
                </option>
                <option value="yes" className="text-gray-900">
                  {translations["survey.steps.pickup.canPickup"]}
                </option>
                <option value="no" className="text-gray-900">
                  {translations["survey.steps.pickup.cannotPickup"]}
                </option>
                <option value="maybe" className="text-gray-900">
                  {translations["survey.steps.pickup.maybePickup"]}
                </option>
              </select>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <h3 className="font-medium text-green-900 mb-1">
                  {translations["survey.completion.title"]}
                </h3>
                <p className="text-green-800 text-sm">
                  {translations["survey.completion.description"]}
                </p>
              </div>

              <div className="flex justify-between">
                <button
                  onClick={handlePrevious}
                  className="border border-gray-300 hover:bg-gray-100 text-gray-800 px-6 py-2 rounded-md flex items-center gap-2 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300"
                  aria-label="Previous question"
                >
                  <ArrowLeftIcon className="h-4 w-4" />{" "}
                  {translations["survey.back"]}
                </button>
                <Link
                  href="/map"
                  className="bg-green-600 hover:bg-green-700 focus:ring-2 focus:ring-green-300 text-white px-6 py-2 rounded-md flex items-center gap-2 transition-colors focus:outline-none"
                  aria-label="Find food pantries near you"
                >
                  {translations["survey.findPantries"]}
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

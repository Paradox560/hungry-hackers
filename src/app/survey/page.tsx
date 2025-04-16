"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/solid";
import { useTranslation } from "@/i18n";
import { useLocalizedContent } from "@/hooks/useLocalizedContent";
import TranslatedText from "@/components/TranslatedText";

export default function Chatbot() {
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState({
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
  const { t } = useTranslation();

  // Load all translations needed for this page
  useEffect(() => {
    const loadAllTranslations = async () => {
      const keys = [
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
  }, []);

  const handleNext = () => setStep(step + 1);
  const handlePrevious = () => setStep(Math.max(1, step - 1));

  const totalSteps = 8;

  // Progress calculation
  const progress = (step / totalSteps) * 100;

  if (isLoading) {
    return <div className="p-6 text-center">Loading...</div>;
  }

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white shadow-lg rounded-lg my-8">
      {/* Progress indicator */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-500 mb-1">
          <TranslatedText
            textKey="survey.progress"
            params={{ current: step, total: totalSteps }}
          />
          <TranslatedText
            textKey="survey.complete"
            params={{ percentage: Math.round(progress) }}
          />
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
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
          <h2 className="text-xl font-semibold mb-4">
            {translations["survey.steps.location.title"]}
          </h2>
          <label htmlFor="location" className="block text-gray-700 mb-2">
            {translations["survey.steps.location.question"]}
          </label>
          <input
            id="location"
            type="text"
            value={answers.location}
            onChange={(e) =>
              setAnswers({ ...answers, location: e.target.value })
            }
            className="border border-gray-300 px-4 py-2 w-full mb-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
          <h2 className="text-xl font-semibold mb-4">
            {translations["survey.steps.date.title"]}
          </h2>
          <label htmlFor="day" className="block text-gray-700 mb-2">
            {translations["survey.steps.date.question"]}
          </label>
          <input
            id="day"
            type="text"
            placeholder={translations["survey.steps.date.placeholder"]}
            value={answers.day}
            onChange={(e) => setAnswers({ ...answers, day: e.target.value })}
            className="border border-gray-300 px-4 py-2 w-full mb-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            aria-required="true"
          />
          <div className="flex justify-between">
            <button
              onClick={handlePrevious}
              className="border border-gray-300 hover:bg-gray-100 text-gray-700 px-6 py-2 rounded-md flex items-center gap-2 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300"
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
          <h2 className="text-xl font-semibold mb-4">
            {translations["survey.steps.time.title"]}
          </h2>
          <label htmlFor="time" className="block text-gray-700 mb-2">
            {translations["survey.steps.time.question"]}
          </label>
          <input
            id="time"
            type="text"
            placeholder={translations["survey.steps.time.placeholder"]}
            value={answers.time}
            onChange={(e) => setAnswers({ ...answers, time: e.target.value })}
            className="border border-gray-300 px-4 py-2 w-full mb-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            aria-required="true"
          />
          <div className="flex justify-between">
            <button
              onClick={handlePrevious}
              className="border border-gray-300 hover:bg-gray-100 text-gray-700 px-6 py-2 rounded-md flex items-center gap-2 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300"
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
          <h2 className="text-xl font-semibold mb-4">
            {translations["survey.steps.transport.title"]}
          </h2>
          <label htmlFor="transport" className="block text-gray-700 mb-2">
            {translations["survey.steps.transport.question"]}
          </label>
          <select
            id="transport"
            value={answers.hasTransport}
            onChange={(e) =>
              setAnswers({ ...answers, hasTransport: e.target.value })
            }
            className="border border-gray-300 px-4 py-2 w-full mb-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            aria-required="true"
          >
            <option value="">
              {translations["survey.steps.transport.selectOption"]}
            </option>
            <option value="yes">
              {translations["survey.steps.transport.hasTransport"]}
            </option>
            <option value="no">
              {translations["survey.steps.transport.noTransport"]}
            </option>
            <option value="limited">
              {translations["survey.steps.transport.limitedTransport"]}
            </option>
          </select>
          <div className="flex justify-between">
            <button
              onClick={handlePrevious}
              className="border border-gray-300 hover:bg-gray-100 text-gray-700 px-6 py-2 rounded-md flex items-center gap-2 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300"
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
          <h2 className="text-xl font-semibold mb-4">
            {translations["survey.steps.diet.title"]}
          </h2>
          <label htmlFor="dietary" className="block text-gray-700 mb-2">
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
            className="border border-gray-300 px-4 py-2 w-full mb-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <div className="flex justify-between">
            <button
              onClick={handlePrevious}
              className="border border-gray-300 hover:bg-gray-100 text-gray-700 px-6 py-2 rounded-md flex items-center gap-2 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300"
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
          <h2 className="text-xl font-semibold mb-4">
            {translations["survey.steps.kitchen.title"]}
          </h2>
          <label htmlFor="kitchen" className="block text-gray-700 mb-2">
            {translations["survey.steps.kitchen.question"]}
          </label>
          <select
            id="kitchen"
            value={answers.hasKitchen}
            onChange={(e) =>
              setAnswers({ ...answers, hasKitchen: e.target.value })
            }
            className="border border-gray-300 px-4 py-2 w-full mb-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            aria-required="true"
          >
            <option value="">
              {translations["survey.steps.kitchen.selectOption"]}
            </option>
            <option value="yes">
              {translations["survey.steps.kitchen.fullAccess"]}
            </option>
            <option value="limited">
              {translations["survey.steps.kitchen.limitedAccess"]}
            </option>
            <option value="no">
              {translations["survey.steps.kitchen.noAccess"]}
            </option>
          </select>
          <div className="flex justify-between">
            <button
              onClick={handlePrevious}
              className="border border-gray-300 hover:bg-gray-100 text-gray-700 px-6 py-2 rounded-md flex items-center gap-2 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300"
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
          <h2 className="text-xl font-semibold mb-4">
            {translations["survey.steps.services.title"]}
          </h2>
          <label htmlFor="services" className="block text-gray-700 mb-2">
            {translations["survey.steps.services.question"]}
          </label>
          <textarea
            id="services"
            placeholder={translations["survey.steps.services.placeholder"]}
            value={answers.services}
            onChange={(e) =>
              setAnswers({ ...answers, services: e.target.value })
            }
            className="border border-gray-300 px-4 py-2 w-full mb-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={3}
          />
          <div className="flex justify-between">
            <button
              onClick={handlePrevious}
              className="border border-gray-300 hover:bg-gray-100 text-gray-700 px-6 py-2 rounded-md flex items-center gap-2 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300"
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
          <h2 className="text-xl font-semibold mb-4">
            {translations["survey.steps.pickup.title"]}
          </h2>
          <label htmlFor="pickup" className="block text-gray-700 mb-2">
            {translations["survey.steps.pickup.question"]}
          </label>
          <select
            id="pickup"
            value={answers.canSomeonePickup}
            onChange={(e) =>
              setAnswers({ ...answers, canSomeonePickup: e.target.value })
            }
            className="border border-gray-300 px-4 py-2 w-full mb-6 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            aria-required="true"
          >
            <option value="">
              {translations["survey.steps.pickup.selectOption"]}
            </option>
            <option value="yes">
              {translations["survey.steps.pickup.canPickup"]}
            </option>
            <option value="no">
              {translations["survey.steps.pickup.cannotPickup"]}
            </option>
            <option value="maybe">
              {translations["survey.steps.pickup.maybePickup"]}
            </option>
          </select>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <h3 className="font-medium text-green-800 mb-1">
              {translations["survey.completion.title"]}
            </h3>
            <p className="text-green-700 text-sm">
              {translations["survey.completion.description"]}
            </p>
          </div>

          <div className="flex justify-between">
            <button
              onClick={handlePrevious}
              className="border border-gray-300 hover:bg-gray-100 text-gray-700 px-6 py-2 rounded-md flex items-center gap-2 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300"
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
  );
}

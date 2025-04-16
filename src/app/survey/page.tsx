"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/solid";
import { useTranslation } from "@/i18n";
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
  const { t, locale } = useTranslation();

  // Load all translations needed for this page
  useEffect(() => {
    const loadAllTranslations = async () => {
      setIsLoading(true);
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
    // Re-run the effect whenever the locale changes.
  }, [locale]); 

  const handleNext = () => setStep(step + 1);
  const handlePrevious = () => setStep(Math.max(1, step - 1));

  const totalSteps = 8;
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

      {/* (Rest of your steps remain unchanged...) */}

    </div>
  );
}

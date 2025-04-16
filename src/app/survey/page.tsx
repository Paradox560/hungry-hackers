"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/solid";

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

  const handleNext = () => setStep(step + 1);
  const handlePrevious = () => setStep(Math.max(1, step - 1));

  const totalSteps = 8;

  // Progress calculation
  const progress = (step / totalSteps) * 100;

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white shadow-lg rounded-lg my-8">
      {/* Progress indicator */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-500 mb-1">
          <span>
            Step {step} of {totalSteps}
          </span>
          <span>{Math.round(progress)}% Complete</span>
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
          <h2 className="text-xl font-semibold mb-4">Location Information</h2>
          <label htmlFor="location" className="block text-gray-700 mb-2">
            📍 What is your address or location?
          </label>
          <input
            id="location"
            type="text"
            value={answers.location}
            onChange={(e) =>
              setAnswers({ ...answers, location: e.target.value })
            }
            className="border border-gray-300 px-4 py-2 w-full mb-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter your address or neighborhood"
            aria-required="true"
          />
          <div className="flex justify-end">
            <button
              onClick={handleNext}
              className="bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-300 text-white px-6 py-2 rounded-md flex items-center gap-2 transition-colors focus:outline-none"
              aria-label="Next question"
            >
              Next <ArrowRightIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="transition-all duration-300 animate-fadeIn">
          <h2 className="text-xl font-semibold mb-4">Date Preference</h2>
          <label htmlFor="day" className="block text-gray-700 mb-2">
            📅 Do you want food today or another day this week?
          </label>
          <input
            id="day"
            type="text"
            placeholder="e.g., Today, Friday, Next Tuesday"
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
              <ArrowLeftIcon className="h-4 w-4" /> Back
            </button>
            <button
              onClick={handleNext}
              className="bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-300 text-white px-6 py-2 rounded-md flex items-center gap-2 transition-colors focus:outline-none"
              aria-label="Next question"
            >
              Next <ArrowRightIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="transition-all duration-300 animate-fadeIn">
          <h2 className="text-xl font-semibold mb-4">Time Preference</h2>
          <label htmlFor="time" className="block text-gray-700 mb-2">
            ⏰ What time of day works best for you?
          </label>
          <input
            id="time"
            type="text"
            placeholder="e.g., Morning, 2pm, Evening"
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
              <ArrowLeftIcon className="h-4 w-4" /> Back
            </button>
            <button
              onClick={handleNext}
              className="bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-300 text-white px-6 py-2 rounded-md flex items-center gap-2 transition-colors focus:outline-none"
              aria-label="Next question"
            >
              Next <ArrowRightIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="transition-all duration-300 animate-fadeIn">
          <h2 className="text-xl font-semibold mb-4">Transportation Access</h2>
          <label htmlFor="transport" className="block text-gray-700 mb-2">
            🚗 Do you have access to a private vehicle or public transit?
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
            <option value="">Please select an option</option>
            <option value="yes">Yes, I have transportation</option>
            <option value="no">No, I don't have transportation</option>
            <option value="limited">
              I have limited transportation options
            </option>
          </select>
          <div className="flex justify-between">
            <button
              onClick={handlePrevious}
              className="border border-gray-300 hover:bg-gray-100 text-gray-700 px-6 py-2 rounded-md flex items-center gap-2 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300"
              aria-label="Previous question"
            >
              <ArrowLeftIcon className="h-4 w-4" /> Back
            </button>
            <button
              onClick={handleNext}
              className="bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-300 text-white px-6 py-2 rounded-md flex items-center gap-2 transition-colors focus:outline-none"
              aria-label="Next question"
            >
              Next <ArrowRightIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {step === 5 && (
        <div className="transition-all duration-300 animate-fadeIn">
          <h2 className="text-xl font-semibold mb-4">Dietary Needs</h2>
          <label htmlFor="dietary" className="block text-gray-700 mb-2">
            🥗 Do you have any dietary restrictions or preferences?
          </label>
          <input
            id="dietary"
            type="text"
            placeholder="e.g., diabetic, halal, low sodium, vegetarian"
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
              <ArrowLeftIcon className="h-4 w-4" /> Back
            </button>
            <button
              onClick={handleNext}
              className="bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-300 text-white px-6 py-2 rounded-md flex items-center gap-2 transition-colors focus:outline-none"
              aria-label="Next question"
            >
              Next <ArrowRightIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {step === 6 && (
        <div className="transition-all duration-300 animate-fadeIn">
          <h2 className="text-xl font-semibold mb-4">Kitchen Access</h2>
          <label htmlFor="kitchen" className="block text-gray-700 mb-2">
            🏠 Do you have access to a kitchen to store or cook food?
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
            <option value="">Please select an option</option>
            <option value="yes">Yes, full kitchen access</option>
            <option value="limited">
              Limited access (microwave/refrigerator only)
            </option>
            <option value="no">No kitchen access</option>
          </select>
          <div className="flex justify-between">
            <button
              onClick={handlePrevious}
              className="border border-gray-300 hover:bg-gray-100 text-gray-700 px-6 py-2 rounded-md flex items-center gap-2 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300"
              aria-label="Previous question"
            >
              <ArrowLeftIcon className="h-4 w-4" /> Back
            </button>
            <button
              onClick={handleNext}
              className="bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-300 text-white px-6 py-2 rounded-md flex items-center gap-2 transition-colors focus:outline-none"
              aria-label="Next question"
            >
              Next <ArrowRightIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {step === 7 && (
        <div className="transition-all duration-300 animate-fadeIn">
          <h2 className="text-xl font-semibold mb-4">Additional Services</h2>
          <label htmlFor="services" className="block text-gray-700 mb-2">
            🧾 Do you need any additional services?
          </label>
          <textarea
            id="services"
            placeholder="e.g., housing, job training, childcare"
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
              <ArrowLeftIcon className="h-4 w-4" /> Back
            </button>
            <button
              onClick={handleNext}
              className="bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-300 text-white px-6 py-2 rounded-md flex items-center gap-2 transition-colors focus:outline-none"
              aria-label="Next question"
            >
              Next <ArrowRightIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {step === 8 && (
        <div className="transition-all duration-300 animate-fadeIn">
          <h2 className="text-xl font-semibold mb-4">Final Details</h2>
          <label htmlFor="pickup" className="block text-gray-700 mb-2">
            👨‍👩‍👧 Can a relative or friend pick up food for you?
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
            <option value="">Please select an option</option>
            <option value="yes">Yes, someone can pick up for me</option>
            <option value="no">No, I need to pick up myself</option>
            <option value="maybe">Maybe, depends on timing</option>
          </select>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <h3 className="font-medium text-green-800 mb-1">
              Thank you for completing the survey!
            </h3>
            <p className="text-green-700 text-sm">
              Click below to find pantries near you based on your preferences.
            </p>
          </div>

          <div className="flex justify-between">
            <button
              onClick={handlePrevious}
              className="border border-gray-300 hover:bg-gray-100 text-gray-700 px-6 py-2 rounded-md flex items-center gap-2 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300"
              aria-label="Previous question"
            >
              <ArrowLeftIcon className="h-4 w-4" /> Back
            </button>
            <Link
              href="/map"
              className="bg-green-600 hover:bg-green-700 focus:ring-2 focus:ring-green-300 text-white px-6 py-2 rounded-md flex items-center gap-2 transition-colors focus:outline-none"
              aria-label="Find food pantries near you"
            >
              Find Pantries
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

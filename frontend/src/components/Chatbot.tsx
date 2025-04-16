'use client'

import type { Site } from './FoodMap'
import { useState } from 'react'
import FoodMap from './MapClient'

export default function Chatbot() {
  const [step, setStep] = useState(1)
  const [answers, setAnswers] = useState({
    location: '',
    day: '',
    time: '',
    hasTransport: '',
    dietary: '',
    hasKitchen: '',
    services: '',
    canSomeonePickup: '',
  })
  const [suggestions, setSuggestions] = useState<Site[]>([])

  const handleNext = () => setStep(step + 1)

  const handleSubmit = async () => {
    const res = await fetch('/api/suggestions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(answers),
    })
    const data = await res.json()
    setSuggestions(data)
  }

  return (
    <div className="p-6 max-w-xl mx-auto">
      {step === 1 && (
        <>
          <p>📍 What is your address or location?</p>
          <input
            type="text"
            value={answers.location}
            onChange={(e) => setAnswers({ ...answers, location: e.target.value })}
            className="border px-2 py-1 w-full mb-2"
          />
          <button onClick={handleNext} className="bg-blue-600 text-white px-4 py-2 rounded">Next</button>
        </>
      )}

      {step === 2 && (
        <>
          <p>📅 Do you want food today or another day this week?</p>
          <input
            type="text"
            placeholder="e.g., Today, Friday, Next Tuesday"
            value={answers.day}
            onChange={(e) => setAnswers({ ...answers, day: e.target.value })}
            className="border px-2 py-1 w-full mb-2"
          />
          <button onClick={handleNext} className="bg-blue-600 text-white px-4 py-2 rounded">Next</button>
        </>
      )}

      {step === 3 && (
        <>
          <p>⏰ What time of day works best?</p>
          <input
            type="text"
            placeholder="e.g., Morning, 2pm, Evening"
            value={answers.time}
            onChange={(e) => setAnswers({ ...answers, time: e.target.value })}
            className="border px-2 py-1 w-full mb-2"
          />
          <button onClick={handleNext} className="bg-blue-600 text-white px-4 py-2 rounded">Next</button>
        </>
      )}

      {step === 4 && (
        <>
          <p>🚗 Do you have access to a private vehicle or public transit?</p>
          <select
            value={answers.hasTransport}
            onChange={(e) => setAnswers({ ...answers, hasTransport: e.target.value })}
            className="border px-2 py-1 w-full mb-2"
          >
            <option value="">Select one</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
          <button onClick={handleNext} className="bg-blue-600 text-white px-4 py-2 rounded">Next</button>
        </>
      )}

      {step === 5 && (
        <>
          <p>🥗 Do you have any dietary restrictions or preferences?</p>
          <input
            type="text"
            placeholder="e.g., diabetic, halal, low sodium"
            value={answers.dietary}
            onChange={(e) => setAnswers({ ...answers, dietary: e.target.value })}
            className="border px-2 py-1 w-full mb-2"
          />
          <button onClick={handleNext} className="bg-blue-600 text-white px-4 py-2 rounded">Next</button>
        </>
      )}

      {step === 6 && (
        <>
          <p>🏠 Do you have access to a kitchen to store or cook food?</p>
          <select
            value={answers.hasKitchen}
            onChange={(e) => setAnswers({ ...answers, hasKitchen: e.target.value })}
            className="border px-2 py-1 w-full mb-2"
          >
            <option value="">Select one</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
          <button onClick={handleNext} className="bg-blue-600 text-white px-4 py-2 rounded">Next</button>
        </>
      )}

      {step === 7 && (
        <>
          <p>🧾 Do you need any additional services?</p>
          <textarea
            placeholder="e.g., housing, job training, childcare"
            value={answers.services}
            onChange={(e) => setAnswers({ ...answers, services: e.target.value })}
            className="border px-2 py-1 w-full mb-2"
          />
          <button onClick={handleNext} className="bg-blue-600 text-white px-4 py-2 rounded">Next</button>
        </>
      )}

      {step === 8 && (
        <>
          <p>👨‍👩‍👧 Can a relative or friend pick up food for you?</p>
          <select
            value={answers.canSomeonePickup}
            onChange={(e) => setAnswers({ ...answers, canSomeonePickup: e.target.value })}
            className="border px-2 py-1 w-full mb-2"
          >
            <option value="">Select one</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
          <button onClick={handleSubmit} className="bg-green-600 text-white px-4 py-2 rounded">Find Pantries</button>
        </>
      )}

      {suggestions.length > 0 && (
        <>
          <h2 className="text-xl font-bold mt-6 mb-2">Top Matches</h2>
          {suggestions.map((site, i) => (
            <div key={i} className="p-4 border rounded mb-4 text-left">
              <h3 className="font-bold">{site.name}</h3>
              <p>{site.address}</p>
              <p>{site.phone}</p>
              <p>{site.hours}</p>
              <p className="text-sm italic">{site.requirements}</p>
            </div>
          ))}
          <FoodMap sites={suggestions} />
        </>
      )}
    </div>
  )
}

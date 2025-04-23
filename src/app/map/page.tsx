"use client";

import React, { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import Image from "next/image";
import L from "leaflet";
import Papa from "papaparse";
import "leaflet/dist/leaflet.css";
import { useTranslation } from "@/i18n";

// Fix Leaflet Icons
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// Ensure Leaflet icon fix runs only on the client side
import ChatBot from 'react-chatbotify'
import Loading from "../components/Loading";
// import dynamic from "next/dynamic";

// Interfaces
interface FoodBank {
  lat: number;
  lon: number;
  address: string;
}

interface MapUpdaterProps {
  center: [number, number];
}

// MapUpdater Component
function MapUpdater({ center }: MapUpdaterProps) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, 13);
    }
  }, [center, map]);
  return null;
}

// Utility Functions
function cleanAddress(raw: string): string {
  const match = raw.match(/\d{1,5} .*/);
  return match ? match[0] : raw;
}

// const MapClient = dynamic(() => import("@/app/components/MapClient"), { ssr: false });

const geocodeAddress = async (address: string): Promise<{
  lat: number;
  lon: number;
} | null> => {
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
    address
  )}`;

  try {
    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
        "User-Agent": "leaflet-map-example/1.0",
      },
    });
    const data = await response.json();

    if (data && data.length > 0) {
      return {
        lat: parseFloat(data[0].lat),
        lon: parseFloat(data[0].lon),
      };
    }
  } catch (error) {
    console.error("Geocoding error:", address, error);
  }

  return null;
};

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const flow={
  start: {
    message: "Hi! Do you have any more questions?",
    path: "gemini_call1"
  },
  gemini_call1: {
    message: async () => {
      await sleep(10000);
      return "Hello! I'm the Capital Area Foodbank's Helper ChatBot. I can help you find food pantries near you. To get started, could you please share your address or general location (like your neighborhood, zip code, or a major intersection)?"
    },
    path: "gemini_call2"
  },
  gemini_call2: {
    message: async () => {
      await sleep(10000);
      return "Got it, thank you Suhan! That location helps narrow down the search. Next, are you looking to get food today, or would another day this week work better for you?"
    },
    path: "gemini_call3"
  },
  gemini_call3: {
    message: async () => {
      await sleep(10000);
      return "Okay, Tuesday. What time of day on Tuesday would you like to pick up food? For example, morning, afternoon, or evening?"
    },
    path: "gemini_call4"
  },
  gemini_call4: {
    message: async () => {
      await sleep(10000);
      return "Okay, Tuesday morning. Are you able to travel to a food pantry using a private vehicle or public transit?"
    },
    path: "gemini_call5"
  },
  gemini_call5: {
    message: async () => {
      await sleep(10000);
      return "Great, having a vehicle gives you more options.Next, do you have any dietary restrictions or diet-related illnesses? For example, are you diabetic, do you have high blood pressure, need low-sodium or low-sugar options, prefer mostly fresh produce, or follow a Halal diet?"
    },
    path: "gemini_call6"
  },
  gemini_call6: {
    message: async () => {
      await sleep(10000);
      return "Okay, no dietary restrictions. Do you have access to a kitchen where you can store and/or cook food?"
    },
    path: "gemini_call7"
  },
  gemini_call7: {
    message: async () => {
      await sleep(10000);
      return "Okay, you have access to a kitchen. Do you also need help finding any other services, like housing assistance, help with government benefits, health care, job training, or anything similar?"
    },
    path: "gemini_call8"
  },
  gemini_call8: {
    message: async () => {
      await sleep(10000);
      return "Children of Mine, Address: 2263 Mount View Place, SE, Washington DC 20020. This location matches your address exactly and is open on Tuesday mornings during the 2nd and 4th weeks of the month. No specific requirements listed. Please call ahead to confirm they are operating this specific Tuesday and have food available. Walk-up service. phone: (202) 374-6029"
    },
    path: "gemini_call4"
  },
  // repeated: {
  //   message: "I hope that helped answer your question, is there anything else I can help you with?",
  //   function: (params) => setForm({...form, name: params.userInput}),
  //   path: "repeated"
  // },
  // gemini_call: {
  //   message: (params) => {
  //     let apiKey = params.userInput.trim();
  //     return "Ask me anything!";
  //   },
  //   path: "loop",
  // },
  // loop: {
  //   message: async (params) => {
  //     await  fetch("/api/generate", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //         body: JSON.stringify({user_message: params}),
  //     });
  //     }
  //   },
  //   path: () => {
  //     if (hasError) {
  //       return "start"
  //     }
  //     return "loop"
  //   }
};

const Chatbot = () => {
	const [form, setForm] = React.useState({});
	const formStyle = {
		marginTop: 10,
		marginLeft: 20,
		border: "1px solid #491d8d",
		padding: 10,
		borderRadius: 5,
		maxWidth: 300
	}

	const flow = {
		start: {
			message: "Hello there! What is your name?",
			function: (params) => setForm({...form, name: params.userInput}),
			path: "ask_age"
		},
		ask_age: {
			message: (params) => `Nice to meet you ${params.userInput}, what is your age?`,
			function: (params) => setForm({...form, age: params.userInput}),
			path: "ask_pet"
		},
		ask_pet: {
			message: "Do you own any pets?",
			// alternative way to declare options, with sending of output disabled
			// more info here: https://react-chatbotify.com/docs/api/attributes
			// options: {items: ["Yes", "No"], sendOutput: false}
			options: ["Yes", "No"],
			chatDisabled: true,
			function: (params) => setForm({...form, pet_ownership: params.userInput}),
			path: "ask_choice"
		},
		ask_choice: {
			message: "Select at least 2 pets that you are comfortable to work with:",
			// alternative way to declare checkboxes, with default configurations (i.e. min 1, max 4, send output and not reusable)
			// more info here: https://react-chatbotify.com/docs/api/attributes
			// checkboxes: ["Dog", "Cat", "Rabbit", "Hamster"]
			checkboxes: {items: ["Dog", "Cat", "Rabbit", "Hamster"], min: 2},
			chatDisabled: true,
			function: (params) => setForm({...form, pet_choices: params.userInput}),
			path: "ask_work_days"
		},
		ask_work_days: {
			message: "How many days can you work per week?",
			function: (params) => setForm({...form, num_work_days: params.userInput}),
			path: "end"
		},
		end: {
			message: "Thank you for your interest, we will get back to you shortly!",
			component: (
				<div style={formStyle}>
					<p>Name: {form.name}</p>
					<p>Age: {form.age}</p>
					<p>Pet Ownership: {form.pet_ownership}</p>
					<p>Pet Choices: {form.pet_choices}</p>
					<p>Num Work Days: {form.num_work_days}</p>
				</div>
			),
			options: ["New Application"],
			chatDisabled: true,
			path: "start"
		},
	}
	return (
    <ChatBot settings={{
      general: {
        embedded: true
      },
      chatHistory: {
        storageKey: "example_basic_form"
      }
    }} flow={flow} />
	);
};

// Chatbot Component
const Chatbot1: React.FC = () => {
  const handleClick = () => {
    alert("Working on adding a chatbot");
  };

  return (
    <div
      className="chatbot-icon"
      onClick={handleClick}
      style={{
        position: "fixed",
        bottom: "650px",
        right: "20px",
        cursor: "pointer",
      }}
    >
      <Image
        width={80}
        height={80}
        src="/chat_icon.png"
        alt="Chatbot Icon"
        style={{
          width: "100px",
          height: "100px",
          zIndex: "1000",
          margin: "10px",
        }}
      />
    </div>
  );
};

// Main Component
export default function MapPage() {
  const [center, setCenter] = useState<[number, number]>([38.89511, -77.03637]); // Default DC
  const [foodBanks, setFoodBanks] = useState<FoodBank[]>([]);
  const addressRef = useRef<HTMLInputElement>(null);
  const [translations, setTranslations] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const { t, locale, isLoaded } = useTranslation();

  // Load translations whenever the locale changes.
  useEffect(() => {
    if (!isLoaded) return; // Wait for translations to load
    const loadTranslations = async () => {
      setIsLoading(true);
      const keys = [
        "map.title",
        "map.description",
        "map.enterAddress",
        "map.locate",
        "map.useMyLocation",
      ];

      const translatedTexts: Record<string, string> = {};
      for (const key of keys) {
        translatedTexts[key] = await t(key);
      }

      setTranslations(translatedTexts);
      setIsLoading(false);
    };

    loadTranslations();
  }, [locale, isLoaded]); // Added locale here

  useEffect(() => {
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: markerIcon2x,
      iconUrl: markerIcon,
      shadowUrl: markerShadow,
    });
  }, []);

  const loadAndGeocode = async () => {
    const files = ["shopping_partners.csv", "mobile_markets.csv"];
    const allAddresses: string[] = [];

    for (const file of files) {
      const response = await fetch(`/data/${file}`);
      const text = await response.text();
      const parsed = Papa.parse(text, { header: true });
      parsed.data.forEach((row: any) => {
        if (row["Shipping Address"]) {
          allAddresses.push(cleanAddress(row["Shipping Address"]));
        }
      });
    }

    const geocoded: FoodBank[] = [];
    for (const address of allAddresses) {
      const coords = await geocodeAddress(address);
      if (coords) {
        geocoded.push({ ...coords, address });
      } else {
        console.warn("Could not geocode:", address);
      }
    }

    setFoodBanks(geocoded);
  };

  useEffect(() => {
    loadAndGeocode();
  }, []);

  const locateUser = () => {
    navigator.geolocation.getCurrentPosition((pos) => {
      const { latitude, longitude } = pos.coords;
      setCenter([latitude, longitude]);
    });
  };

  const handleAddressSearch = async () => {
    const input = addressRef.current?.value;
    if (!input) return;

    const coords = await geocodeAddress(input);
    if (coords) {
      setCenter([coords.lat, coords.lon]);
    } else {
      alert("Could not locate that address.");
    }
  };

  return (
    ((!isLoaded && typeof window !== "undefined") ? (
      <Loading />
     ) : (
    <div style={{ color: "black" }}>
      <div className="bg-gradient-to-r from-blue-50 to-green-50 p-4 shadow-md">
        <h2 className="text-xl font-semibold text-gray-800 mb-2 flex items-center">
          <span className="mr-1">🗺️</span>
          {translations["map.title"]}
        </h2>
        
        <p className="text-gray-600 mb-3 text-sm">
          {translations["map.description"]}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-2 mb-3">
          <div className="flex-grow relative">
            <input
              ref={addressRef}
              type="text"
              placeholder={translations["map.enterAddress"]}
              className="w-full px-3 py-1 text-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              aria-label="Enter address"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none text-gray-400 text-sm">
              📍
            </div>
          </div>
          
          <button 
            onClick={handleAddressSearch}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 text-sm transition-colors duration-200 flex items-center justify-center"
            aria-label="Search for this address"
          >
            <span className="mr-1">🔍</span>
            {translations["map.locate"]}
          </button>
        </div>
        
        <button 
          onClick={locateUser}
          className="w-full sm:w-auto bg-gray-100 hover:bg-gray-200 text-gray-800 border border-gray-300 px-4 py-1 text-sm transition-colors duration-200 flex items-center justify-center"
          aria-label="Use my current location"
        >
          <span className="mr-1">📱</span>
          {translations["map.useMyLocation"]}
        </button>
      </div>

      <MapContainer
        center={center}
        zoom={12}
        style={{ height: "80vh", width: "100%" }}
      >
        <MapUpdater center={center} />
        <TileLayer
          attribution="© OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
            {foodBanks.map((fb, idx) => (
          console.log("Food Bank:", fb.address, fb.lat, fb.lon),
          <Marker key={idx} position={[fb.lat, fb.lon]}>
            <Popup>{fb.address}</Popup>
          </Marker>
        ))}
      </MapContainer>
          {/* <MapClient center={center} foodBanks={foodBanks} /> */}
      <ChatBot settings={{ header: { title: <div>Food Bank Helper</div> } }} flow={flow} />
    </div>
     ))
    );
}

"use client";

import React, { useEffect, useState, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";
import Image from "next/image";
import L from "leaflet";
import Papa from "papaparse";
import "leaflet/dist/leaflet.css";

// Fix Leaflet Icons
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// Ensure Leaflet icon fix runs only on the client side
import ChatBot from 'react-chatbotify'

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

const flow={
  start: {
    message: "Hi! Do you have any more questions?",
    function: (params) => setForm({...form, name: params.userInput}),
    path: "repeated"
  },
  repeated: {
    message: "I hope that helped answer your question, is there anything else I can help you with?",
    function: (params) => setForm({...form, name: params.userInput}),
    path: "repeated"
  }
}

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

	const flow={
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
		<ChatBot settings={{general: {embedded: true}, chatHistory: {storageKey: "example_basic_form"}}} flow={flow}/>
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
        // src="https://static.vecteezy.com/system/resources/thumbnails/006/692/321/small_2x/chatting-message-icon-template-black-color-editable-chatting-message-icon-symbol-flat-illustration-for-graphic-and-web-design-free-vector.jpg"
        alt="Chatbot Icon"
        style={{ width: "100px", height: "100px", zIndex: "1000", margin: "10px"}}
      />
    </div>
  );
};

// Main Component
export default function Home() {
  const [center, setCenter] = useState<[number, number]>([38.89511, -77.03637]); // Default DC
  const [foodBanks, setFoodBanks] = useState<FoodBank[]>([]);
  const addressRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: markerIcon2x,
      iconUrl: markerIcon,
      shadowUrl: markerShadow,
    });
  }, []);

  const loadAndGeocode = async () => {
    const files = ["shopping_partners.csv", "mobile_markets.csv"];
    const allAddresses: string[] = [];

    for (let file of files) {
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
    for (let address of allAddresses) {
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
    <div style={{color: "black"}}>
      <div style={{ padding: "10px", backgroundColor: "#f2f2f2" }}>
        <h2 style={{ marginBottom: "5px" }}>🗺️ Find Food Banks Near You</h2>
        <p>
          Enter your address and click locate to find nearby food banks.
          <br />
          Ingrese su dirección y haga clic en localizar para encontrar bancos de
          alimentos cercanos.
        </p>
        <div style={{ marginBottom: "10px" }}>
          <input style={{border: 1}}
            ref={addressRef}
            type="text"
            placeholder="Enter address..."
            style={{ padding: "5px", width: "300px" }}
          />
          <button
            onClick={handleAddressSearch}
            style={{ marginLeft: "5px" }}
          >
            📌 Locate
          </button>
        </div>
        <button onClick={locateUser} style={{ margin: "10px" }}>
          📍 Use My Location
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
          <Marker key={idx} position={[fb.lat, fb.lon]}>
            <Popup>{fb.address}</Popup>
          </Marker>
        ))}
      </MapContainer>
      <ChatBot settings={{ header: { title: <div>Food Bank Helper</div> } }} flow={flow} />
    </div>
  );
}
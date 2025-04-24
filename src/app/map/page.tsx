"use client";

import React, { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import Image from "next/image";
import L from "leaflet";
import Papa from "papaparse";
import "leaflet/dist/leaflet.css";
import { useTranslation } from "@/i18n";

// Fix Leaflet Icons
// import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
// import markerIcon from "leaflet/dist/images/marker-icon.png";
// import markerShadow from "leaflet/dist/images/marker-shadow.png";

// Ensure Leaflet icon fix runs only on the client side
import ChatBot from 'react-chatbotify'
// import dynamic from "next/dynamic";
import { icon } from "leaflet"

const markerIcon2x = icon({
  iconUrl: "/marker-icon-2x.png",
  iconSize: [32, 32],
})
const markerIcon = icon({
  iconUrl: "/marker-icon.png",
  iconSize: [32, 32],
})
const markerShadow = icon({
  iconUrl: "/marker-shadow.png",
  iconSize: [32, 32],
})
// Interfaces
interface FoodBank {
  lat: number;
  lon: number;
  address: string;
}

interface MapUpdaterProps {
  center: [number, number];
}

const address_to_coord = {
  "421 Clifford Ave Alexandria VA 22305": {lat: 38.8320336, lon:-77.0530997}, 
"9832 Piscataway Road Clinton MD 20735": {lat: 38.7537896, lon:-76.9223848}, 
"801 University Blvd W Silver Spring MD 20901": {lat: 39.0412414, lon:-77.0524083}, 
"9801 Livingston Road Fort Washington MD 20744": {lat: 38.7556609, lon:-77.0009664}, 
"3845 South Capitol St SW Washington DC 20032": {lat: 38.8341748, lon:-77.0089621}, 
"6300 9th St NW  Washington DC  DC 20011": {lat: 38.966347, lon:-77.0262483}, 
"1501 Columbia Rd NW Washington DC 20009": {lat: 38.9270507, lon:-77.0359884}, 
"6012 Ager Road Hyattsville MD 20782": {lat: 38.9624832, lon:-76.9698595}, 
"3103 Shepherd Street Mount Rainier MD 20712": {lat: 38.9395435, lon:-76.9636211}, 
"10845 Lanham Severn Road Glenn Dale MD 20769": {lat: 38.9859145, lon:-76.8210757}, 
"1 Wells Ave Gaithersburg MD 20877": {lat: 39.1409984, lon:-77.1923173}, 
"2815 Old Lee Hwy Fairfax Fairfax VA 22031": {lat: 38.8757888, lon:-77.2392203}, 
"5600 Old Branch Avenue Camp Springs MD 20748": {lat: 38.8130599, lon:-76.9130871}, 
"3209 5th Street SE Washington DC 20032": {lat: 38.842617, lon:-76.9997498}, 
"1908 North Capitol Street NW Washington DC 20002": {lat: 38.9157583, lon:-77.0095097}, 
"11310 Fort Washington Road Fort Washington MD 20744": {lat: 38.7396063, lon:-77.0000327}, 
"6 Capitol Heights Blvd Capitol Heights MD 20743": {lat: 38.8852076, lon:-76.9138748}, 
"1625 Olive Street NE Washington DC 20019": {lat: 38.9104865, lon:-76.9334733}, 
"2700 19th Street South Arlington VA 22204": {lat: 38.8541288, lon:-77.0831513}, 
"2101 Shadyside Ave  Suitland MD  20746": {lat: 38.862301, lon:-76.932234}, 
"25 Quire Ave Capitol Heights MD 20743": {lat: 38.8863372, lon:-76.9120974}, 
"5 Thomas Circle NW Washington DC 20005": {lat: 38.9064998, lon:-77.0327273}, 
"8899 Sudley Road Manassas VA 20110": {lat: 38.7637627, lon:-77.4783669}, 
"1925 Mitchellville Rd Bowie MD 20716": {lat: 38.9156728, lon:-76.7216523}, 
"5757 Temple Hill Road Camp Springs MD 20748": {lat: 38.8040834, lon:-76.9332718}, 
"4606 16th St NW Washington DC 20011": {lat: 38.9468507, lon:-77.036771}, 
"2938 Prosperity Avenue Fairfax VA 22031": {lat: 38.8721204, lon:-77.2368594}, 
"910 Addison Road Capitol Heights MD 20743": {lat: 38.8705089, lon:-76.894135}, 
"25 Crescent Rd Greenbelt MD 20770": {lat: 39.0005734, lon:-76.8773857}, 
"71 O ST NW Washington DC 20002": {lat: 38.9089563, lon:-77.0114316}, 
"620 Michigan Ave NE Washington DC 20064": {lat: 38.9391024, lon:-76.9999642}, 
"5819 Eastpine Dr Riverdale MD 20737": {lat: 38.9583116, lon:-76.9065907}, 
"6100 Georgia Avenue NW  Washington  DC 20011": {lat: 38.9641578, lon:-77.0281926}, 
"1600 Saint Camillus Drive  Silver Spring MD 20903": {lat: 39.0094437, lon:-76.9816625}, 
"5033 Wilson Lane Bethesda MD 20814": {lat: 38.9896048, lon:-77.1229785}, 
"1810 16th St NW Washington DC 20009": {lat: 38.9143737, lon:-77.0369513}, 
"1600 Morris Rd SE Washington DC 20020": {lat: 38.8578053, lon:-76.981506}, 
"12701 Veirs Mill Rockville MD 20853": {lat: 39.0737472, lon:-77.1124428}, 
"9350 Main Street Manassas VA 20110": {lat: 38.7516111, lon:-77.4720402}, 
"308 Gorman Ave Laurel  MD 20707": {lat: 39.0984608, lon:-76.8506114}, 
"814 Alabama Ave SE Washington DC 20032": {lat: 38.8440468, lon:-76.9938772}, 
"11700 Beltsville Drive Beltsville MD 20705": {lat: 39.052639, lon:-76.9355426}, 
"4115 Alabama Ave SE  Washington DC 20019": {lat: 38.8706096, lon:-76.9422796}, 
"1525 Newton St NW Washington DC 20910": {lat: 38.933592, lon:-77.0355665}, 
"220 Highview Place SE  Washington DC 20032": {lat: 38.8415051, lon:-77.0045614}, 
"4303 13th st NE Washington DC 20017": {lat: 38.9420099, lon:-76.988045}, 
"3890 Cameron Street Dumfries Va 22026": {lat: 38.5686422, lon:-77.3287835}, 
"6801 Walker Mill Rd Capitol Heights MD 20743": {lat: 38.8686339, lon:-76.8906355}, 
"4915 Saint Barnabas Road Temple Hills MD 20748": {lat: 38.8219741, lon:-76.9565649}, 
"2260 York Drive Woodbridge VA 22191": {lat: 38.65418, lon:-77.279687}, 
"304 East Church Road Sterling VA 20164": {lat: 39.0078829, lon:-77.3928168}, 
"1325 Maryland Ave NE Washington DC 20002": {lat: 38.8990226, lon:-76.9864891}, 
"6304 Lee Chapel Rd Burke VA 22015": {lat: 38.7810083, lon:-77.2771312}, 
"9155 Richmond Hwy Fort Belvoir VA 22060": {lat: 38.7168981, lon:-77.1326408}, 
"1920 G Street NW Washington DC 20006": {lat: 38.8980713, lon:-77.0446813}, 
"805 Brightseat Rd Landover MD 20785": {lat: 38.9160199, lon:-76.8603179}, 
"6608 Wilkins Place Forestville MD 20747": {lat: 38.840773, lon:-76.8932991}, 
"4900 Connecticut Ave NW  Washington DC  20008": {lat: 38.954414, lon:-77.069584}, 
"5340 Baltimore Ave Hyattsville MD 20781": {lat: 38.9551316, lon:-76.940885}, 
"6210 Chillum Place NW Washington DC 20011": {lat: 38.9660472, lon:-77.0111547}, 
"1100 Florida Ave NE Washington DC 20002": {lat: 38.9036929, lon:-76.9915544}, 
"10100 Old Georgetown Road Bethesda MD 20814": {lat: 39.0016497, lon:-77.1098522}, 
"1400 G St Woodbridge  VA 22191": {lat: 38.6606663, lon:-77.2529184}, 
"2465 Alabama Ave SE Washington DC 20020": {lat: 38.8546279, lon:-76.9696303}, 
"880 Eastern Ave  NE Washington DC 20019": {lat: 38.9070891, lon:-76.9275424}, 
"11416 Cedar Lane Beltsville MD 20705": {lat: 39.0423799, lon:-76.9181754}, 
"317 N Payne Street Alexandria VA 22314": {lat: 38.8087712, lon:-77.0525098}, 
"12604 New Hampshire Avenue Silver Spring MD 20904": {lat: 39.0761335, lon:-77.0019544}, 
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
  console.log("address" + url);
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

interface aiResponse {
  address: string, 
  hours: string, 
  name: string, 
  note: string, 
  phone: string
}

const flow={
  // start: {
  //   message: "Hi! Do you have any more questions?",
  //   path: "gemini_call1"
  // },
  // gemini_call1: {
  //   message: async () => {
  //     await sleep(10000);
  //     return "Hello! I'm the Capital Area Foodbank's Helper ChatBot. I can help you find food pantries near you. To get started, could you please share your address or general location (like your neighborhood, zip code, or a major intersection)?"
  //   },
  //   path: "gemini_call2"
  // },
  // gemini_call2: {
  //   message: async () => {
  //     await sleep(10000);
  //     return "Got it, thank you Suhan! That location helps narrow down the search. Next, are you looking to get food today, or would another day this week work better for you?"
  //   },
  //   path: "gemini_call3"
  // },
  // gemini_call3: {
  //   message: async () => {
  //     await sleep(10000);
  //     return "Okay, Tuesday. What time of day on Tuesday would you like to pick up food? For example, morning, afternoon, or evening?"
  //   },
  //   path: "gemini_call4"
  // },
  // gemini_call4: {
  //   message: async () => {
  //     await sleep(10000);
  //     return "Okay, Tuesday morning. Are you able to travel to a food pantry using a private vehicle or public transit?"
  //   },
  //   path: "gemini_call5"
  // },
  // gemini_call5: {
  //   message: async () => {
  //     await sleep(10000);
  //     return "Great, having a vehicle gives you more options.Next, do you have any dietary restrictions or diet-related illnesses? For example, are you diabetic, do you have high blood pressure, need low-sodium or low-sugar options, prefer mostly fresh produce, or follow a Halal diet?"
  //   },
  //   path: "gemini_call6"
  // },
  // gemini_call6: {
  //   message: async () => {
  //     await sleep(10000);
  //     return "Okay, no dietary restrictions. Do you have access to a kitchen where you can store and/or cook food?"
  //   },
  //   path: "gemini_call7"
  // },
  // gemini_call7: {
  //   message: async () => {
  //     await sleep(10000);
  //     return "Okay, you have access to a kitchen. Do you also need help finding any other services, like housing assistance, help with government benefits, health care, job training, or anything similar?"
  //   },
  //   path: "gemini_call8"
  // },
  // gemini_call8: {
  //   message: async () => {
  //     await sleep(10000);
  //     return "Children of Mine, Address: 2263 Mount View Place, SE, Washington DC 20020. This location matches your address exactly and is open on Tuesday mornings during the 2nd and 4th weeks of the month. No specific requirements listed. Please call ahead to confirm they are operating this specific Tuesday and have food available. Walk-up service. phone: (202) 374-6029"
  //   },
  //   path: "gemini_call4"
  // },
  start: {
    message: "Hi is there anything I can help you with?",
    path: "gemini_call",
  },

  repeated: {
    message: "I hope that helped answer your question, is there anything else I can help you with?",
    function: (params) => setForm({...form, name: params.userInput}),
    path: "repeated"
  },
  gemini_call: {
    message: (params) => {
      let apiKey = params.userInput.trim();
      return "Ask me anything!";
    },
    path: "loop",
  },
  loop: {
    message: async (params) => {
      let res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
          body: JSON.stringify({user_message: params}),
      });
      const res_data: aiResponse = (await res.json()).data;
      console.log(res_data);
      return `A good spot would be ${res_data.name}, it is located at ${res_data.address}, it is open from ${res_data.hours} and you can contact it using this phone number: ${res_data.phone}`;
    },
    path: "loop"
  }
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

      console.log("parsed");
      console.log(parsed);
      parsed.data.forEach((row: any) => {
        if (row["Shipping Address"]) {
          allAddresses.push(cleanAddress(row["Shipping Address"]));
        }
      });
    }

    // console.log("shipping");
    // console.log(allAddresses);
    
    const geocoded: FoodBank[] = [];
    for (const [address, coords] of Object.entries(address_to_coord)) {
      geocoded.push({ ...coords, address });
    }

    for (const address of allAddresses) {
      const coords = await geocodeAddress(address);
      if (coords) {
        geocoded.push({ ...coords, address });
        setFoodBanks(geocoded);
      } else {
        console.warn("Could not geocode:", address);
      }
    }

    console.log("geocoded");
    console.log(geocoded);
    
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
      <div className="p-6 text-center">Loading...</div>
     ) : (
    <div style={{ color: "black" }}>
      <div className="bg-gradient-to-r from-blue-50 to-green-50 p-4 shadow-md">
        <h2 className="text-xl font-semibold text-gray-800 mb-2 flex items-center">
          
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
          <Marker icon={markerIcon} key={idx} position={[fb.lat, fb.lon]}>
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

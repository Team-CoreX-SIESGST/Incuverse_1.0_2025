"use client";

import { useState, useRef } from "react";
import { MapPin, Search } from "lucide-react";

export default function LocationSearch({ onPlaceSelected }) {
  const [searchValue, setSearchValue] = useState("");
  const [predictions, setPredictions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef(null);

  // Initialize Google Places Autocomplete
  const initAutocomplete = () => {
    if (!window.google) {
      console.error("Google Maps API not loaded");
      return;
    }

    const autocomplete = new window.google.maps.places.Autocomplete(
      inputRef.current,
      {
        types: ["(cities)"],
        componentRestrictions: { country: "in" }, // Restrict to India
      }
    );

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      if (place.geometry) {
        onPlaceSelected(place);
        setSearchValue(place.formatted_address);
      }
    });
  };

  // Load Google Maps script
  const loadGoogleMaps = () => {
    if (window.google) {
      initAutocomplete();
      return;
    }

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = initAutocomplete;
    document.head.appendChild(script);
  };

  const handleFocus = () => {
    loadGoogleMaps();
  };

  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-5 w-5 text-slate-400" />
      </div>
      <input
        ref={inputRef}
        type="text"
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        onFocus={handleFocus}
        placeholder="Search for your city or area in India..."
        className="block w-full pl-10 pr-3 py-2.5 bg-slate-50/50 dark:bg-slate-800/40 text-slate-900 dark:text-slate-50 rounded-lg ring-1 ring-inset ring-slate-900/10 dark:ring-slate-100/10 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-inset focus:ring-emerald-500 transition-all duration-200"
      />
    </div>
  );
}

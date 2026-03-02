import React from "react";
import { Mail, Phone, User } from "lucide-react";

export default function Footer() {
  return (
    <footer
      className="
     w-full
    bottom-0 left-0
    py-3
    
    bg-gradient-to-r from-purple-700 via-pink-400 to-blue-700
    bg-opacity-40
    backdrop-blur-xl
    text-white
    z-50
    flex items-center justify-around gap-6
    shadow-[0_4px_20px_rgba(255,255,255,0.2)]
  "
    >
      {/* Nom & copyright */}
      <p className=" flex items-center gap-2">
        © 2025 — A Mandaniaina Précieux. Tous droits réservés.
      </p>

      {/* Infos contact */}
      <div className="flex  items-center gap-22">
        {/* Email */}
        <div className="flex items-center gap-2">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="white"
            strokeWidth="2"
            viewBox="0 0 24 24"
          > 
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 4h16v16H4V4zm0 4l8 5 8-5"
            />
          </svg>
          <span>:    mandaniainaprecieux@yahoo.com</span>
        </div>

        {/* Téléphone */}
        <div className="flex items-center gap-2">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="white"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 5a2 2 0 012-2h3l2 5-2 1a11 11 0 005 5l1-2 5 2v3a2 2 0 01-2 2h-1C9 18 6 15 3 11V5z"
            />
          </svg>
          <span>:   +261 34 61 223 35 </span>
        </div>
      </div>
    </footer>
  );
}

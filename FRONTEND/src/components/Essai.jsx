import React from "react";
import aze1 from "../assets/images/aze1.png";

const YokCountLanding = () => {
  return (
    <div className=" w-full h-screen bg-gradient-to-br from-pink-500 via-purple-500 to-blue-600 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-pink-400/20 via-purple-400/20 to-blue-500/20"></div>

      {/* Navigation */}
      <nav className="relative z-10 px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            {/* Logo */}
            {/* <div className="text-white text-2xl font-bold">YokCount</div> */}

            {/* Navigation Links */}
            {/* <div className="hidden md:flex items-center space-x-8 bg-white/10 backdrop-blur-md rounded-full px-8 py-3 border border-white/20">
              <a
                href="#"
                className="text-white hover:text-white/80 transition-colors"
              >
                Home
              </a>
              <a
                href="#"
                className="text-white hover:text-white/80 transition-colors"
              >
                Business
              </a>
              <a
                href="#"
                className="text-white hover:text-white/80 transition-colors"
              >
                Growing State
              </a>
              <a
                href="#"
                className="text-white hover:text-white/80 transition-colors"
              >
                Support
              </a>
            </div> */}

            {/* Contact Button */}
            {/* <button className="bg-white text-gray-800 px-6 py-3 rounded-full font-semibold hover:bg-white/90 transition-colors">
              Contact Us
            </button> */}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative z-10 px-6 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <h1 className="text-5xl lg:text-7xl font-bold text-white leading-tight">
                Prenez soin
                <br />
                de votre sourire
                <br />
                dès aujourd'hui.
              </h1>

              <div className="space-y-6">
                <p className="text-white/80 text-lg leading-relaxed max-w-md">
                  Réservez facilement votre rendez-vous en ligne avec l’un de
                  nos dentistes qualifiés.
                </p>

                <button className="bg-white/20 backdrop-blur-md text-white px-8 py-4 rounded-full font-semibold border border-white/30 hover:bg-white/30 transition-all duration-300">
                  Prenez Un Rendez-Vous
                </button>
              </div>
            </div>

            {/* Right Content - Image */}
            <div className="relative">
              <div className="relative">
                {/* Decorative circle background */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-white/5 rounded-full transform rotate-12 scale-110"></div>

                {/* Main image container */}
                <div className="relative bg-white/10 backdrop-blur-md rounded-full p-4 border border-white/20">
                  <div className="aspect-square rounded-full overflow-hidden">
                    <img
                      src={aze1}
                      alt="Portrait d'un patient ou d'un modèle"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Decorative elements */}
                <div className="absolute -top-4 -right-4 w-8 h-8 bg-white/30 rounded-full backdrop-blur-sm"></div>
                <div className="absolute -bottom-6 -left-6 w-12 h-12 bg-white/20 rounded-full backdrop-blur-sm"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Additional decorative elements */}
      <div className="absolute top-1/4 left-10 w-2 h-2 bg-white/40 rounded-full"></div>
      <div className="absolute top-1/3 right-20 w-3 h-3 bg-white/30 rounded-full"></div>
      <div className="absolute bottom-1/4 left-1/4 w-4 h-4 bg-white/20 rounded-full"></div>

      {/* Mobile Navigation Toggle (hidden by default) */}
      <div className="md:hidden fixed top-4 right-4 z-20">
        <button className="bg-white/20 backdrop-blur-md p-3 rounded-full border border-white/30">
          <div className="w-6 h-6 flex flex-col justify-center space-y-1">
            <div className="w-full h-0.5 bg-white"></div>
            <div className="w-full h-0.5 bg-white"></div>
            <div className="w-full h-0.5 bg-white"></div>
          </div>
        </button>
      </div>
    </div>
  );
};

export default YokCountLanding;

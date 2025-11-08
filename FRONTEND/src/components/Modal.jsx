// Modal.js
import React from "react";

const Modal = ({ show, title, message, onClose }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-[8px] flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-11/12 text-center transform transition-all scale-105">
        {title && (
          <h2 className="text-blue-600 font-bold text-xl mb-3">{title}</h2>
        )}
        <p className="text-gray-700 text-lg mb-6">{message}</p>
        <button
          onClick={onClose}
          className="bg-blue-600 text-white px-5 py-2 rounded-lg shadow hover:bg-blue-700 transition"
        >
          OK
        </button>
      </div>
    </div>
  );
};

export default Modal;

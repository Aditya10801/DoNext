import React from "react";

export default function Recommendation() {
  return (
    <div className="px-[30px] py-[20px] w-full">
      <div className="flex justify-between my-5">
        <p className="text-[#5A6061] text-lg items-center font-semibold ">
          Your Recommendation
        </p>
        <div className="flex gap-1 text-[#5A6061] items-center  cursor-pointer">
            
          {"New task"}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 -960 960 960"
            width="24px"
            fill="#5A6061"
            className="text-sm"
          >
            <path d="M204-318q-22-38-33-78t-11-82q0-134 93-228t227-94h7l-64-64 56-56 160 160-160 160-56-56 64-64h-7q-100 0-170 70.5T240-478q0 26 6 51t18 49l-60 60ZM481-40 321-200l160-160 56 56-64 64h7q100 0 170-70.5T720-482q0-26-6-51t-18-49l60-60q22 38 33 78t11 82q0 134-93 228t-227 94h-7l64 64-56 56Z" />
          </svg>
        </div>
      </div>

      {/* Outer Card - removed shadow, added subtle border */}
      <div className="w-full bg-white rounded-[32px] p-6 border border-[#E4E9EA]">
        {/* Top Section: Icon and Badge */}
        <div className="flex justify-between items-start mb-4">
          <div className="w-12 h-12 bg-[#E4E9EA] rounded-xl flex items-center justify-center">
            {/* List Icon */}
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#5A6061"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="8" y1="6" x2="21" y2="6"></line>
              <line x1="8" y1="12" x2="21" y2="12"></line>
              <line x1="8" y1="18" x2="21" y2="18"></line>
              <line x1="3" y1="6" x2="3.01" y2="6"></line>
              <line x1="3" y1="12" x2="3.01" y2="12"></line>
              <line x1="3" y1="18" x2="3.01" y2="18"></line>
            </svg>
          </div>

          <span className="bg-[#E4E9EA] text-[#5A6061] text-[10px] font-bold px-3 py-1.5 rounded-lg uppercase tracking-wider">
            Best Choice
          </span>
        </div>

        {/* Title Section */}
        <div className="mb-6">
          <h2 className="text-[#2D3132] text-xl font-bold">
            Review Design Feedback
          </h2>
          <p className="text-[#8A9091] text-sm font-medium mt-1">
            Fits your time perfectly
          </p>
        </div>

        {/* Divider */}
        <div className="h-[1px] bg-[#E4E9EA] w-full mb-6" />

        {/* Stats Section */}
        <div className="flex gap-8 mb-8">
          <div className="flex items-center gap-2 text-[#5A6061]">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            <span className="text-[12px] font-bold uppercase tracking-wide">
              12 Min
            </span>
          </div>

          <div className="flex items-center gap-2 text-[#5A6061]">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path>
            </svg>
            <span className="text-[12px] font-bold uppercase tracking-wide">
              High Priority
            </span>
          </div>
        </div>

        {/* Action Button - Matches the style of your Start Now button */}
        <button className="w-full bg-[#D9E2FF] hover:bg-[#99A8DB] text-[#5A6061] py-5 rounded-[20px] text-lg font-bold transition-colors">
          Start now
        </button>
      </div>
    </div>
  );
}

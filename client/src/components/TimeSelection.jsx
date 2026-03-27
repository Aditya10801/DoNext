import React, { useState } from 'react';

export default function TimeSelection() {
  const [selectedTime, setSelectedTime] = useState('60m');
  const options = ['15m', '30m', '45m', '60m'];

  return (
 
    <div className="px-[30px] py-[20px] w-fit">
      <p className="text-[#5A6061] text-sm font-semibold mb-5">Available Time</p>
      
      <div className="flex gap-4">
        {options.map((time) => (
          <button
            key={time}
            onClick={() => setSelectedTime(time)}
            className={`
              w-[70px] py-[14px] rounded-xl text-md font-medium transition-all
              ${selectedTime === time 
                ? 'bg-[#E0E7FF] text-[#5A6061] shadow-sm ring-1 ring-black/5' 
                : 'bg-[#E9EDEE] text-[#5A6061] hover:bg-[#DEE3E4]'           
              }
            `}
          >
            {time}
          </button>
        ))}
      </div>
      
      <div className="bg-gradient-to-r from-[#505E82] to-[#445275] text-[#F7F7FF] font-bold flex flex-cols justify-center items-center w-full py-[14px] rounded-xl mt-5 cursor-pointer">
Do Next
      </div>
    </div>
  );
}
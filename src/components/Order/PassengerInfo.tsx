import React from "react";

export interface PassengerType {
    title: string;
    name: string;
    id: string;
    phone: string;
    email: string;
  }
  
  interface PassengerInfoProps {
    passenger: PassengerType;
  }

const PassengerInfo: React.FC<PassengerInfoProps> = ({passenger}) => {
    
  return (
    <>
      {/* 標題 */}
      <ul
        className={`bg-[#fff] w-full border-y border-solid border-[#E5E6EB] py-[20px] px-[16px] flex flex-col gap-[12px] md:gap-[20px] md:border md:rounded-[16px] md:p-[40px] `}
      >
        <li className={`text-[20px] `}>{passenger.title}</li>
        <li
          className={`border border-solid border-[#E5E6EB] rounded-[4px] md:rounded-[8px] overflow-hidden`}
        >
          {/* 姓名 */}
          <div
            className={`py-[8px] px-[12px] border-b border-solid border-[#E5E6EB] md:p-0 md:flex `}
          >
            <div
              className={`text-[#86909C] md:border-r md:border-solid md:border-[#E5E6EB] md:bg-[#F7F8FA] md:py-[9px] md:px-[20px] `}
            >
              <p className={`w-[112px]`}>姓名</p>
            </div>
            <div
              className={`md:py-[9px] md:px-[20px] md:w-full  md:border-b md:border-solid md:border-[#E5E6EB]`}
            >
              <p className={``}>{passenger.name}</p>
            </div>
          </div>

          {/* 身分證或護照號碼 */}
          <div
            className={`py-[8px] px-[12px] border-b border-solid border-[#E5E6EB] md:p-0 md:flex `}
          >
            <div
              className={`text-[#86909C] md:border-r md:border-solid md:border-[#E5E6EB] md:bg-[#F7F8FA] md:py-[9px] md:px-[20px] `}
            >
              <p className={`w-[112px]`}>身分證或護照號碼</p>
            </div>
            <div
              className={`md:py-[9px] md:px-[20px] md:w-full  md:border-b md:border-solid md:border-[#E5E6EB]`}
            >
              <p>{passenger.id}</p>
            </div>
          </div>

          {/* 電話 */}
          <div
            className={`py-[8px] px-[12px] border-b border-solid border-[#E5E6EB] md:p-0 md:flex `}
          >
            <div
              className={`text-[#86909C] md:border-r md:border-solid md:border-[#E5E6EB] md:bg-[#F7F8FA] md:py-[9px] md:px-[20px] `}
            >
              <p className={`w-[112px]`}>電話</p>
            </div>
            <div
              className={`md:py-[9px] md:px-[20px] md:w-full  md:border-b md:border-solid md:border-[#E5E6EB]`}
            >
              <p>{passenger.phone}</p>
            </div>
          </div>

          {/* 信箱 */}
          <div
            className={`py-[8px] px-[12px] border-b border-solid border-[#E5E6EB] md:p-0 md:flex `}
          >
            <div
              className={`text-[#86909C] md:border-r md:border-solid md:border-[#E5E6EB] md:bg-[#F7F8FA] md:py-[9px] md:px-[20px] `}
            >
              <p className={`w-[112px]`}>Email</p>
            </div>
            <div
              className={`md:py-[9px] md:px-[20px] md:w-full  md:border-b md:border-solid md:border-[#E5E6EB]`}
            >
              <p>{passenger.email}</p>
            </div>
          </div>
        </li>
      </ul>
    </>
  );
};

export default PassengerInfo;

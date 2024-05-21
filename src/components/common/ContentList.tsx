import React from "react";

interface ContentListType {
    title: string
    content: string
}

const ContentList: React.FC<ContentListType> = ({title, content}) => {
  return (
    <>
      <div className={` border-b border-solid border-[#E5E6EB] flex `}>
        <div
          className={`text-[#86909C] md:border-r md:border-solid md:border-[#E5E6EB] md:bg-[#F7F8FA] md:py-[9px] md:px-[20px] `}
        >
          <p className={`w-[112px]`}>{title}</p>
        </div>
        <div
          className={`md:py-[9px] md:px-[20px] md:w-full  md:border-b md:border-solid md:border-[#E5E6EB]`}
        >
          <p className={``}>{content}</p>
        </div>
      </div>
    </>
  );
};

export default ContentList;

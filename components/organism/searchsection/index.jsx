import React from "react";

export default function SearchSection({ func }) {
  return (
    <div className=" flex justify-center w-full ">
      <div className="relative w-full ">
        <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
          <svg aria-hidden="true" className="w-5 h-5 text-gray-500 darkdisable:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
        </div>

        <input
          type="search"
          id="default-search"
          className="block w-full h-10  p-4 indent-6  text-sm  text-gray-900 bg-gray-50 rounded-[60px] border border-gray-300 focus:ring-blue-500 focus:border-blue-500 darkdisable:bg-gray-700 darkdisable:border-gray-600 darkdisable:placeholder-gray-400 darkdisable:text-white darkdisable:focus:ring-blue-500 darkdisable:focus:border-blue-500 "
          placeholder="Cari sayur, buah, makanan dan lain-lain"
          required
          name="search"
          onChange={func}
          // onChange={handleSearch}
          // onFocus={handleSearchVis}
          // onBlur={handleSearchVis}
        />
      </div>
      {/* <form className=" flex-none w-11/12 sm:w-2/3 relative">
      <div className={`${searchVis} bg-white  w-full absolute z-10   border-2 shadow-md `}>
        <div className="px-2 py-4  w-full h-fit bg-white rounded-sm">
          <div className=" text-black ">
            {searchCampaigns.length > 0 ? (
              searchCampaigns.map((camp) => {
                return (
                  <a
                    href={`/campaigns/`}
                    onClick={(e) => {
                      searchClick(camp.id_camp);
                    }}
                  >
                    <p className="hover:bg-gray-200 px-2 py-1 rounded-sm">{camp.nama_camp}</p>
                  </a>
                );
              })
            ) : (
              <p className=" text-center text-gray-300 py-10">Event Not Found</p>
            )}
          </div>
        </div>
      </div>
    </form> */}
    </div>
  );
}

"use client";
import React from "react";
import Searchbar from "./Searchbar";
import UpdatesBell from "./UpdatesBell";
import { useDispatch } from "react-redux";
import { setProgress } from "@/redux/features/loadingBarSlice";
import { MdOutlineMenu } from "react-icons/md";
import { IoClose } from "react-icons/io5";
import Sidebar from "./Sidebar/Sidebar";
import MeowLogo from "./MeowLogo";

const Navbar = () => {
  const dispatch = useDispatch();
  const [showNav, setShowNav] = React.useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = React.useState(false);
  return (
    <>
      <header className="sticky top-2 z-40 px-2 sm:px-4 md:px-6 my-1">
        <nav className="mx-auto max-w-7xl h-[62px] text-white flex justify-between items-center px-3 sm:px-5 rounded-2xl md:rounded-full bg-[#0a0f1d]/75 backdrop-blur-2xl border border-white/15 shadow-[0_8px_32px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.18)] transition-all duration-300">
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              aria-label="Open Navigation Menu"
              onClick={() => setShowNav(true)}
              className="p-2 rounded-xl text-gray-200 hover:text-white hover:bg-white/10 active:scale-95 transition-all cursor-pointer"
            >
              <MdOutlineMenu className="text-2xl lg:text-2xl" />
            </button>
            <div
              className={`flex items-center transition-all duration-300 ${
                mobileSearchOpen
                  ? "opacity-0 pointer-events-none w-0 overflow-hidden md:opacity-100 md:pointer-events-auto md:w-auto md:overflow-visible"
                  : "opacity-100"
              }`}
            >
              <MeowLogo />
            </div>
          </div>
          <div className="relative flex items-center justify-end gap-1 sm:gap-2">
            <Searchbar
              mobileSearchOpen={mobileSearchOpen}
              setMobileSearchOpen={setMobileSearchOpen}
            />
            <UpdatesBell mobileSearchOpen={mobileSearchOpen} />
          </div>
        </nav>
      </header>

      <Sidebar showNav={showNav} setShowNav={setShowNav} />
      {/* overlay */}
      <div
        onClick={() => setShowNav(false)}
        className={`${showNav ? "" : "hidden"} transition-all duration-200 fixed top-0 left-0 z-30 w-screen h-screen bg-black bg-opacity-50`}
      ></div>
      <div
        onClick={() => setShowNav(false)}
        className={`${showNav ? "" : "hidden"} md:hidden fixed top-7 right-10 z-50 text-3xl text-white`}
      >
        <IoClose />
      </div>
    </>
  );
};

export default Navbar;

import React from "react";
import Languages from "./Languages";
import Favourites from "./Favourites";
import { FaGithub } from "react-icons/fa";
import { MdOutlineMenu } from "react-icons/md";
import Link from "next/link";
import Profile from "./Profile";
import { useDispatch } from "react-redux";
import Playlists from "./Playlists";
import { setProgress } from "@/redux/features/loadingBarSlice";
import MeowLogo from "../MeowLogo";

const Sidebar = ({ showNav, setShowNav }) => {
  const dispatch = useDispatch();
  return (
    <div
      className={`${
        showNav ? "translate-x-0" : "-translate-x-full"
      } transition-transform duration-300 ease-out h-screen lg:w-[300px] md:w-[260px] w-[75vw] fixed top-0 left-0 z-50 bg-[#060b16]/90 backdrop-blur-2xl border-r border-white/10 shadow-[8px_0_32px_rgba(0,0,0,0.6)] flex flex-col justify-between`}
    >
      <div>
        <div className="flex items-center gap-2 mt-4 px-3">
          <button
            type="button"
            aria-label="Close Navigation Menu"
            onClick={() => setShowNav(false)}
            className="p-2 rounded-xl text-gray-200 hover:text-white hover:bg-white/10 active:scale-95 transition-all cursor-pointer"
          >
            <MdOutlineMenu className="text-2xl lg:text-3xl text-white" />
          </button>
          <div className="flex items-center">
            <MeowLogo />
          </div>
        </div>
        <div className=" mt-7 pb-7 border-b border-gray-400 w-[95%]">
          <Profile setShowNav={setShowNav} />
        </div>
        <div className="flex flex-col gap-1">
          <Languages />
          <hr className="border-gray-400 w-[95%] mx-auto" />
        </div>
        <Favourites setShowNav={setShowNav} />
        <div className="flex flex-col gap-1">
          <hr className="border-gray-400 w-[95%] mx-auto" />
          <Playlists setShowNav={setShowNav} />
          <hr className="border-gray-400 w-[95%] mx-auto" />
        </div>
      </div>
      <div className=" mb-28 text-gray-200 mx-3 flex gap-3">
        <Link href="/dmca">
          <p className="hover:border border-gray-200 p-1 font-medium w-fit rounded cursor-pointer text-sm">
            DMCA
          </p>
        </Link>
        <a
          href="https://github.com/himanshu8443/hayasaka"
          target="_blank"
          rel="noreferrer"
        >
          <p className=" hover:border border-gray-200 p-1 font-medium w-fit rounded cursor-pointer text-sm flex items-center gap-1">
            <FaGithub />
            Github
          </p>
        </a>
      </div>
    </div>
  );
};

export default Sidebar;

import React from "react";
import Image from "next/image";
import {
  HomeIcon,
  ChevronDownIcon,
  BeakerIcon,
  SearchIcon,
  MenuIcon,
} from "@heroicons/react/solid";
import {
  StarIcon,
  BellIcon,
  ChatIcon,
  GlobeIcon,
  PlusIcon,
  SparklesIcon,
  SpeakerphoneIcon,
  VideoCameraIcon,
} from "@heroicons/react/outline";
import { signIn, useSession, signOut } from "next-auth/react";
import Link from "next/link";

function Header() {
  const { data: session } = useSession();
  return (
    <div className="sticky top-0 z-50 flex bg-white px-4 py-2 shadow-sm items-center">
      <div className="relative h-10 w-20 flex-shrink-0 cursor-pointer">
        <Link href="/">
          <Image
            objectFit="contain"
            src="https://upload.wikimedia.org/wikipedia/en/thumb/5/58/Reddit_logo_new.svg/2560px-Reddit_logo_new.svg.png"
            layout="fill"
          />
        </Link>
      </div>
      <Link href="/">
        <div className="mx-7 flex items-center xl:min-w-[300px] cursor-pointer">
          <HomeIcon className="h-5 w-5" />

          <p className="flex-1 ml-2 hidden lg:inline">Home</p>

          <ChevronDownIcon className="h-5 w-5" />
        </div>
      </Link>
      {/* SearchIcon */}
      <form className="hidden lg:flex flex-1 items-center space-x-2 rounded-lg border border-gray-200 bg-gray-100 px-3 py-1">
        <SearchIcon className="h-6 w-6 text-gray-400" />
        <input
          className="flex-1 outline-none bg-gray-100 "
          type="text"
          placeholder="Find something amazing"
        />
        <button type="submit" hidden />
      </form>
      <div className="flex text-gray-500 space-x-2 text-gray-500 hidden lg:inline-flex">
        <SparklesIcon className="icon" />
        <GlobeIcon className="icon" />
        <VideoCameraIcon className="icon" />
        <hr className="h-10 border border-gray-100" />
        <ChatIcon className="icon" />
        <BellIcon className="icon" />
        <PlusIcon className="icon" />
        <SpeakerphoneIcon className="icon" />
      </div>
      <div className="ml-5 flex items-center lg:hidden">
        <MenuIcon className="icon" />
      </div>
      {/* SignIn / SignOut button */}
      {session ? (
        <div
          onClick={() => signOut()}
          className="flex items-center border border-gray-100 p-2 cursor-pointer space-x-2 hover:bg-gray-100"
        >
          <div className="relative h-5 w-5 flex-shrink-0">
            <Image
              objectFit="contain"
              src="https://logoeps.com/wp-content/uploads/2014/09/52053-reddit-logo-icon-vector-icon-vector-eps.png"
              height={5}
              width={5}
              layout="fill"
              alt=""
            />
          </div>
          <div className="flex-1 text-xs">
            <p className="truncate">{session?.user?.name}</p>
            <p className="text-gray-400">1 karma</p>
          </div>
          <ChevronDownIcon className="h-5 flex-shrink-0 text-gray-400" />
        </div>
      ) : (
        <div
          onClick={() => signIn()}
          className="flex items-center border border-gray-100 p-2 cursor-pointer space-x-2 hover:bg-gray-100 mx-auto"
        >
          <div className="relative h-5 w-5 flex-shrink-0">
            <Image
              objectFit="contain"
              src="https://logoeps.com/wp-content/uploads/2014/09/52053-reddit-logo-icon-vector-icon-vector-eps.png"
              height={5}
              width={5}
              layout="fill"
              alt=""
            />
          </div>
          <p className="text-gray-400">Sign In</p>
        </div>
      )}
    </div>
  );
}

export default Header;

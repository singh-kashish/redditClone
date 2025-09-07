// components/Header.tsx
import React from "react";
import Image from "next/image";
import {
  HomeIcon,
  ChevronDownIcon,
  SearchIcon,
  MenuIcon,
} from "@heroicons/react/solid";
import {
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
import { useRouter } from "next/router";

function Header() {
  const { data: session } = useSession();
  const [searchText, setSearchText] = React.useState<string>("");
  const Router = useRouter();
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedText = searchText.trim();
    if (!trimmedText) return;
    // Navigate to search page
    Router.push(`/search/${encodeURIComponent(trimmedText)}`);
  }
  // Clear search input on route change
  React.useEffect(() => {
    const handleRouteChange = () => setSearchText("");
    Router.events.on("routeChangeComplete", handleRouteChange);
    return () => {
      Router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [Router.events]);
  return (
    <div className="sticky top-0 z-10 flex bg-white px-4 py-2 shadow-sm items-center justify-between">
      <div className="relative h-10 w-20 flex-shrink-0 cursor-pointer">
        <Link href="/">
          <Image
            alt="reddit"
            src="https://upload.wikimedia.org/wikipedia/en/1/1f/Reddit_logo_2023.svg"
            fill
            sizes="80px"
            className="object-contain"
          />
        </Link>
      </div>
      <Link href="/" className="lg:mx-7 flex items-center justify-center xl:min-w-[300px] cursor-pointer">
        <HomeIcon className="h-5 w-5 hidden sm:flex" />
        <p className="flex-1 ml-2 hidden sm:inline">Home</p>
        <ChevronDownIcon className="hidden sm:inline sm:h-5 sm:w-5" />
      </Link>

      <form className="hidden md:flex flex-1 items-center space-x-2 rounded-lg border border-gray-200 bg-gray-100 px-3 py-1" onSubmit={handleSearch}>
        <SearchIcon className="h-6 w-6 text-gray-400" />
        <input
          className="flex-1 outline-none bg-gray-100"
          type="text"
          placeholder="Find something amazing, click enter to search"
          value={searchText}
          onChange={(e:React.ChangeEvent<HTMLInputElement>) => setSearchText(e.target.value)}
        />
        <button type="submit" hidden />
      </form>

      <div className="flex text-gray-500 space-x-2 hidden lg:inline-flex">
        <SparklesIcon className="icon" />
        <GlobeIcon className="icon" />
        <VideoCameraIcon className="icon" />
        <hr className="h-10 border border-gray-100" />
        <ChatIcon className="icon" />
        <BellIcon className="icon" />
        <PlusIcon className="icon" />
        <SpeakerphoneIcon className="icon" />
      </div>

      <div className="hidden md:flex ml-5 items-center">
        <MenuIcon className="icon" />
      </div>

      {session ? (
        <button
          onClick={() => void signOut()}
          className="flex items-center border border-gray-100 p-2 cursor-pointer mr-1 md:space-x-2 hover:bg-gray-100"
        >
          <div className="relative h-5 w-5 flex-shrink-0">
            <Image
              alt="tiny"
              src="https://api.dicebear.com/6.x/identicon/png?seed=${encodeURIComponent(clean)}&size=128"
              fill
              sizes="20px"
              style={{ objectFit: "contain" }}
            />
          </div>
          <div className="flex-1 text-xs ml-1">
            <p className="truncate">{session?.user?.name}</p>
            <p className="text-gray-400">1 karma</p>
          </div>
          <ChevronDownIcon className="h-5 flex-shrink-0 text-gray-400" />
        </button>
      ) : (
        <button
          onClick={() => void signIn()}
          className="flex items-center border border-gray-100 p-2 cursor-pointer mr-1 md:space-x-2 hover:bg-gray-100 mx-auto"
        >
          <div className="relative h-5 w-5 flex-shrink-0">
            <Image
              alt="tiny"
              src="https://logoeps.com/wp-content/uploads/2014/09/52053-reddit-logo-icon-vector-icon-vector-eps.png"
              fill
              sizes="20px"
              style={{ objectFit: "contain" }}
            />
          </div>
          <p className="text-gray-400">Sign In</p>
        </button>
      )}
    </div>
  );
}

export default Header;

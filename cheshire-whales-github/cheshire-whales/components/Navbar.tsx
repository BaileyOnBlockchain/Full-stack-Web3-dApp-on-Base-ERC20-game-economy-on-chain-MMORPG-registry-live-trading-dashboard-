"use client";

import Link from "next/link";
import Image from "next/image";
import { WalletConnector } from "./WalletConnector";

export function Navbar() {
  return (
    <header className="header">
      <div className="container h-14 flex items-center justify-between">
        <div className="flex items-center gap-6 -ml-2">
          <Link href="/" className="font-semibold text-lg accent-underline">
            <span className="inline-flex items-center gap-2">
              <Image
                src="/Cheshire%20Whale%20Token.jpg"
                alt="Cheshire Whales logo"
                width={36}
                height={36}
                className="rounded-full ring-1 ring-[var(--border)] logo-glow"
                priority
                placeholder="blur"
                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
              />
              <span className="brand-glow">
                <span className="text-cyan-400" style={{color: '#0fe3ff'}}>Cheshire</span> Whales
              </span>
            </span>
          </Link>
           <nav className="hidden md:flex items-center gap-2 text-sm">
             <Link href="/feed" className="nav-link">Feed</Link>
             <Link href="/chat" className="nav-link">Chat</Link>
             <Link href="/" className="nav-link nav-link-home">Home</Link>
             <Link href="/market" className="nav-link">Blockbay</Link>
             <Link href="/craigsc4lp" className="nav-link">CRAIGSC4LP</Link>
             <Link href="/swap" className="nav-link flex items-center gap-2">
               <Image
                 src="/jose.jpg"
                 alt="Riptide Trading"
                 width={36}
                 height={36}
                 className="rounded-full ring-1 ring-[var(--border)] riptide-icon"
                 priority
               />
               Riptide Trading
             </Link>
             <Link href="/games" className="nav-link flex items-center gap-2">
               <Image
                 src="/Purple Brutus 8-Bit.png"
                 alt="Purple Brutus"
                 width={36}
                 height={36}
                 className="rounded-full ring-1 ring-[var(--border)] games-icon"
                 priority
                 placeholder="blur"
                 blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=="
               />
               Games
             </Link>
           </nav>
        </div>
        <div className="flex items-center gap-3">
          <WalletConnector />
        </div>
      </div>
    </header>
  );
}


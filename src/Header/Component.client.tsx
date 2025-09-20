"use client";
import { useHeaderTheme } from "@/providers/HeaderTheme";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CMSLink } from "@/components/Link";

import type { Festival, Header } from "@/payload-types";

import { Logo } from "@/components/Logo/Logo";
import { isStaticExport } from "@/utilities/isStaticExport";

interface HeaderClientProps {
  data: Header;
  _festivalData: Festival;
}

export const HeaderClient: React.FC<HeaderClientProps> = (
  { data, _festivalData },
) => {
  const [theme, setTheme] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const { headerTheme, setHeaderTheme } = useHeaderTheme();
  const pathname = usePathname();
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setHeaderTheme(null);
  }, [pathname, setHeaderTheme]);

  useEffect(() => {
    if (headerTheme && headerTheme !== theme) setTheme(headerTheme);
  }, [headerTheme, theme]);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    if (isStaticExport()) {
      document.documentElement.style.setProperty("--admin-bar-height", "0px");
    }
  }, []);

  useEffect(() => {
    const updateHeaderHeight = () => {
      if (headerRef.current) {
        const height = headerRef.current.offsetHeight;
        document.documentElement.style.setProperty(
          "--header-height",
          `${height}px`,
        );
      }
    };

    const observer = new ResizeObserver(updateHeaderHeight);
    if (headerRef.current) {
      observer.observe(headerRef.current);
      updateHeaderHeight();
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  const navItems = data?.navItems || [];

  return (
    <header
      ref={headerRef}
      className={`fixed left-0 right-0 z-50 pointer-events-auto bg-black/20 backdrop-blur-md border-b border-white/10 transition-all duration-600 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-full"
      }`}
      style={{ top: "var(--admin-bar-height, 0px)" }}
      {...(theme ? { "data-theme": theme } : {})}
    >
      <div className="container mx-auto px-4 py-4 min-h-[64px]">
        <div className="flex items-center w-full relative">
          <div className="hover:scale-105 active:scale-95 transition-transform duration-200">
            <Link href="/" className="flex items-center space-x-2">
              <Logo
                loading="eager"
                priority="high"
              />
              <span className="text-2xl font-bold">
                大森祭
              </span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-6 absolute left-1/2 transform -translate-x-1/2">
            {navItems.map(({ link }, index) => (
              <div
                key={index}
                className="opacity-0 animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CMSLink
                  type={link.type}
                  reference={link.reference as any}
                  url={link.url}
                  label={link.label}
                  className="text-white/80 hover:text-white transition-colors relative group hover:-translate-y-0.5 active:translate-y-0"
                >
                  <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-400 group-hover:w-full transition-all duration-300" />
                </CMSLink>
              </div>
            ))}
          </div>

          <div className="flex items-center space-x-4 ml-auto">
            <div className="hover:scale-110 active:scale-90 transition-transform duration-200">
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden hover:bg-transparent"
                onClick={() => setIsOpen(!isOpen)}
              >
                <div className="relative w-5 h-5">
                  <Menu
                    className={`absolute w-5 h-5 transition-all duration-300 ease-out ${
                      isOpen
                        ? "opacity-0 rotate-180 scale-75"
                        : "opacity-100 rotate-0 scale-100"
                    }`}
                  />
                  <X
                    className={`absolute w-5 h-5 transition-all duration-300 ease-out ${
                      isOpen
                        ? "opacity-100 rotate-0 scale-100"
                        : "opacity-0 -rotate-180 scale-75"
                    }`}
                  />
                </div>
              </Button>
            </div>
          </div>
        </div>

        <div
          className={`md:hidden w-full overflow-hidden transition-all duration-300 ease-out ${
            isOpen
              ? "max-h-96 opacity-100 translate-y-0 mt-4"
              : "max-h-0 opacity-0 -translate-y-2"
          }`}
        >
          <div className="flex flex-col space-y-2">
            {navItems.map(({ link }, index) => (
              <div
                key={index}
                className={`transform transition-all duration-300 ease-out hover:translate-x-2 active:scale-95 ${
                  isOpen
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-4"
                }`}
                style={{
                  transitionDelay: isOpen ? `${index * 100 + 100}ms` : "0ms",
                }}
                onClick={() => setIsOpen(false)}
              >
                <CMSLink
                  type={link.type}
                  reference={link.reference as any}
                  url={link.url}
                  label={link.label}
                  className="text-white/80 hover:text-white transition-colors duration-200 py-2 block"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
};

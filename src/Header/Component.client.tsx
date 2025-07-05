'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { Menu, X, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'

import type { Header, Festival } from '@/payload-types'

import { Logo } from '@/components/Logo/Logo'
import { Media } from '@/components/Media'

interface HeaderClientProps {
  data: Header
  festivalData: Festival
}

export const HeaderClient: React.FC<HeaderClientProps> = ({ data, festivalData }) => {
  const [theme, setTheme] = useState<string | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [adminBarHeight, setAdminBarHeight] = useState(0)
  const { headerTheme, setHeaderTheme } = useHeaderTheme()
  const pathname = usePathname()

  useEffect(() => {
    setHeaderTheme(null)
  }, [pathname, setHeaderTheme])

  useEffect(() => {
    if (headerTheme && headerTheme !== theme) setTheme(headerTheme)
  }, [headerTheme, theme])

  useEffect(() => {
    setIsVisible(true)
  }, [])

  useEffect(() => {
    const updateAdminBarHeight = () => {
      const adminBar = document.querySelector('.admin-bar') as HTMLElement
      if (adminBar && window.getComputedStyle(adminBar).display !== 'none') {
        setAdminBarHeight(adminBar.offsetHeight)
      } else {
        setAdminBarHeight(0)
      }
    }

    updateAdminBarHeight()
    window.addEventListener('resize', updateAdminBarHeight)
    
    const observer = new MutationObserver(updateAdminBarHeight)
    observer.observe(document.body, { childList: true, subtree: true })

    return () => {
      window.removeEventListener('resize', updateAdminBarHeight)
      observer.disconnect()
    }
  }, [])

  const navItems = data?.navItems || []
  const logo = data?.logo
  const showSearch = data?.showSearch !== false

  return (
    <header
      className={`fixed left-0 right-0 z-30 bg-black/20 backdrop-blur-md border-b border-white/10 transition-all duration-600 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full'
      }`}
      style={{ top: `${adminBarHeight}px` }}
      {...(theme ? { 'data-theme': theme } : {})}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="hover:scale-105 active:scale-95 transition-transform duration-200">
            <Link href="/" className="flex items-center space-x-2">
              {logo ? (
                <Media resource={logo} className="h-8 w-auto" />
              ) : (
                <Logo loading="eager" priority="high" className="invert dark:invert-0" />
              )}
              <span className="text-2xl font-bold text-white hover:text-blue-300 transition-colors">
                大森祭
              </span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-6">
            {navItems.map(({ link }, index) => (
              <div
                key={index}
                className="opacity-0 animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <Link 
                  href={link.url || '#'} 
                  className="text-white/80 hover:text-white transition-colors relative group hover:-translate-y-0.5 active:translate-y-0"
                >
                  {link.label}
                  <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-400 group-hover:w-full transition-all duration-300" />
                </Link>
              </div>
            ))}
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {showSearch && (
              <div
                className="opacity-0 animate-fade-in-up hover:scale-110 active:scale-90 transition-transform duration-200"
                style={{ animationDelay: `${(navItems.length + 1) * 100}ms` }}
              >
                <Link href="/search" className="text-white/80 hover:text-white transition-colors">
                  <Search className="w-5 h-5" />
                </Link>
              </div>
            )}
          </div>

          <div className="hover:scale-110 active:scale-90 transition-transform duration-200">
            <Button 
              variant="ghost" 
              size="sm" 
              className="md:hidden text-white" 
              onClick={() => setIsOpen(!isOpen)}
            >
              <div className="transition-all duration-200">
                {isOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </div>
            </Button>
          </div>
        </div>

        {isOpen && (
          <div className="md:hidden overflow-hidden border-t border-white/10">
            <div className="flex flex-col space-y-2 pt-4 pb-4">
              {navItems.map(({ link }, index) => (
                <div 
                  key={index}
                  className="opacity-0 animate-fade-in-up hover:translate-x-2 active:scale-95 transition-all duration-200"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <Link
                    href={link.url || '#'}
                    className="text-white/80 hover:text-white transition-colors py-2 block"
                    onClick={() => setIsOpen(false)}
                  >
                    {link.label}
                  </Link>
                </div>
              ))}
              
              {showSearch && (
                <div 
                  className="opacity-0 animate-fade-in-up hover:translate-x-2 active:scale-95 transition-all duration-200"
                  style={{ animationDelay: `${navItems.length * 100}ms` }}
                >
                  <Link
                    href="/search"
                    className="text-white/80 hover:text-white transition-colors py-2 block flex items-center space-x-2"
                    onClick={() => setIsOpen(false)}
                  >
                    <Search className="w-4 h-4" />
                    <span>検索</span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

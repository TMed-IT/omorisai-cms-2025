"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface TimeUnit {
  value: number
  label: string
}

interface CountdownProps {
  targetDate: Date
}

export function Countdown({ targetDate }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState<TimeUnit[]>([])
  const [mounted, setMounted] = useState(false)
  const [prevTime, setPrevTime] = useState<TimeUnit[]>([])

  useEffect(() => {
    setMounted(true)

    const calculateTimeLeft = () => {
      const now = new Date().getTime()
      const target = targetDate.getTime()
      const difference = target - now

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24))
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((difference % (1000 * 60)) / 1000)

        return [
          { value: days, label: "日" },
          { value: hours, label: "時間" },
          { value: minutes, label: "分" },
          { value: seconds, label: "秒" },
        ]
      }
      return [
        { value: 0, label: "日" },
        { value: 0, label: "時間" },
        { value: 0, label: "分" },
        { value: 0, label: "秒" },
      ]
    }

    const timer = setInterval(() => {
      setPrevTime(timeLeft)
      setTimeLeft(calculateTimeLeft())
    }, 1000)

    setTimeLeft(calculateTimeLeft())

    return () => clearInterval(timer)
  }, [targetDate])

  const placeholderTime = [
    { value: 0, label: "日" },
    { value: 0, label: "時間" },
    { value: 0, label: "分" },
    { value: 0, label: "秒" },
  ]

  const displayTime = mounted ? timeLeft : placeholderTime

  // グラデーション配列
  const gradients = [
    "from-pink-500 via-red-500 to-yellow-500",
    "from-blue-400 via-purple-500 to-indigo-500",
    "from-green-400 via-cyan-400 to-blue-500",
    "from-fuchsia-500 via-pink-500 to-red-500",
    "from-yellow-400 via-orange-500 to-pink-500",
    "from-indigo-400 via-blue-400 to-cyan-400",
  ]

  // グリッチ用ランダム関数
  function randomGlitch() {
    const v = Math.random()
    if (v < 0.33) return "glitch-1"
    if (v < 0.66) return "glitch-2"
    return "glitch-3"
  }

  return (
    <div className="w-full">
      <div className="flex justify-center items-center gap-4 md:gap-8 lg:gap-12 flex-wrap">
        {displayTime.map((unit, index) => {
          const prev = prevTime[index]?.value
          const isChanged = prev !== undefined && prev !== unit.value
          const grad = gradients[index % gradients.length]
          // 増加/減少でスライド方向を決定
          const slideY = isChanged ? 40 : 0
          const shadowColor = isChanged ? '#fff' : 'transparent'
          return (
            <div key={unit.label} className="flex flex-col items-center relative">
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={unit.value}
                  initial={isChanged ? {
                    opacity: 0,
                    scale: 1.4,
                    y: slideY,
                    filter: "blur(8px)",
                  } : undefined}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    y: 0,
                    filter: isChanged ? "none" : "none",
                    transition: {
                      type: "spring",
                      stiffness: 180,
                      damping: 18,
                      mass: 0.8,
                      background: { duration: 0.5 },
                    },
                  }}
                  exit={isChanged ? {
                    opacity: 0,
                    scale: 0.7,
                    y: -slideY,
                    filter: "blur(12px)",
                  } : undefined}
                  transition={{ duration: 0.7 }}
                  className={`text-5xl md:text-6xl lg:text-7xl font-extrabold bg-gradient-to-br ${grad} text-transparent bg-clip-text tracking-tight select-none`}
                  style={{
                    fontFamily: "'M PLUS 1 Code', monospace",
                    textShadow: 'none',
                  }}
                >
                  {unit.value.toString().padStart(2, "0")}
                </motion.span>
              </AnimatePresence>
              <span
                className="text-base md:text-lg lg:text-xl font-semibold text-white/80 mt-2 tracking-wide"
                style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
              >
                {unit.label}
              </span>
            </div>
          )
        })}
      </div>
      {/* グリッチ用CSS */}
      <style jsx global>{`
        .glitch-1 {
          animation: glitch1 0.5s linear 1;
        }
        .glitch-2 {
          animation: glitch2 0.5s linear 1;
        }
        .glitch-3 {
          animation: glitch3 0.5s linear 1;
        }
        @keyframes glitch1 {
          0% { filter: blur(0px) brightness(1.2); transform: translateX(0) scale(1); }
          20% { filter: blur(2px) brightness(1.5); transform: translateX(-4px) scale(1.1); }
          40% { filter: blur(4px) brightness(1.1); transform: translateX(4px) scale(0.95); }
          60% { filter: blur(2px) brightness(1.3); transform: translateX(-2px) scale(1.05); }
          80% { filter: blur(1px) brightness(1.1); transform: translateX(2px) scale(1); }
          100% { filter: blur(0px) brightness(1.2); transform: translateX(0) scale(1); }
        }
        @keyframes glitch2 {
          0% { filter: blur(0px) hue-rotate(0deg); }
          25% { filter: blur(3px) hue-rotate(30deg); }
          50% { filter: blur(6px) hue-rotate(-30deg); }
          75% { filter: blur(2px) hue-rotate(10deg); }
          100% { filter: blur(0px) hue-rotate(0deg); }
        }
        @keyframes glitch3 {
          0% { filter: blur(0px) contrast(1); }
          30% { filter: blur(4px) contrast(1.5); }
          60% { filter: blur(2px) contrast(0.8); }
          100% { filter: blur(0px) contrast(1); }
        }
      `}</style>
    </div>
  )
}

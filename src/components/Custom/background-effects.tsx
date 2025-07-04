interface BackgroundEffectsProps {
    variant?: "default" | "error" | "maintenance" | "coming-soon"
  }
  
  export function BackgroundEffects({ variant = "default" }: BackgroundEffectsProps) {
    const variants = {
      default: {
        effect1: "from-blue-500 to-purple-600",
        effect2: "from-indigo-500 to-blue-600",
        effect3: "from-purple-500 to-indigo-600",
      },
      error: {
        effect1: "from-red-500 to-pink-600",
        effect2: "from-purple-500 to-indigo-600",
        effect3: "from-orange-500 to-red-600",
      },
      maintenance: {
        effect1: "from-yellow-500 to-orange-600",
        effect2: "from-orange-500 to-red-600",
        effect3: "from-red-500 to-pink-600",
      },
      "coming-soon": {
        effect1: "from-blue-500 to-purple-600",
        effect2: "from-indigo-500 to-blue-600",
        effect3: "from-purple-500 to-indigo-600",
      },
    }
  
    const colors = variants[variant]
  
    return (
      <div className="absolute inset-0">
        <div
          className={`absolute top-20 left-20 w-32 h-32 bg-gradient-to-r ${colors.effect1} rounded-full blur-xl opacity-20 animate-pulse`}
        ></div>
        <div
          className={`absolute bottom-40 right-32 w-48 h-48 bg-gradient-to-r ${colors.effect2} rounded-full blur-xl opacity-15 animate-pulse delay-1000`}
        ></div>
        <div
          className={`absolute top-1/2 left-1/3 w-24 h-24 bg-gradient-to-r ${colors.effect3} rounded-full blur-lg opacity-25 animate-pulse delay-500`}
        ></div>
      </div>
    )
  }
  
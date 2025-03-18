import { useEffect, useState } from "react"

const COUNTDOWN_INTERVAL_MILLISECONDS = 1000

export const useCountdown = (initialValue: number | null) => {
  const [countdown, setCountdown] = useState<number | null>(initialValue)

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null

    if (countdown !== null && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => (prev !== null && prev > 0 ? prev - 1 : null))
      }, COUNTDOWN_INTERVAL_MILLISECONDS)
    }

    return () => {
      if (timer) clearInterval(timer)
    }
  }, [countdown])

  const startCountdown = (seconds: number) => {
    setCountdown(seconds)
  }

  const stopCountdown = () => {
    setCountdown(null)
  }

  return {
    countdown,
    startCountdown,
    stopCountdown,
  }
}

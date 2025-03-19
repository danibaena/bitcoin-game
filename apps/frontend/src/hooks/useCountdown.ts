import { COUNTDOWN_INTERVAL_MILLISECONDS } from "@/constants"
import { useEffect, useState } from "react"

export const useCountdown = (initialValue: number | null) => {
  const [countdown, setCountdown] = useState<number | null>(initialValue)

  useEffect(() => {
    if (countdown === null || countdown <= 0) return

    const timer: NodeJS.Timeout = setInterval(() => {
      setCountdown((prev: number | null) => (prev !== null && prev > 1 ? prev - 1 : null))
    }, COUNTDOWN_INTERVAL_MILLISECONDS)

    return () => clearInterval(timer)
  }, [countdown])

  const startCountdown = (seconds: number): void => {
    setCountdown(seconds)
  }

  const stopCountdown = (): void => {
    setCountdown(null)
  }

  return {
    countdown,
    startCountdown,
    stopCountdown,
  }
}

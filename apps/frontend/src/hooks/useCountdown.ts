import { COUNTDOWN_INTERVAL_MILLISECONDS, TOTAL_COUNTDOWN_MILLISECONDS } from "@/constants"
import { useEffect, useState } from "react"

type CountdownHook = {
  countdown: number | null
  startCountdown: () => void
  stopCountdown: () => void
}

export const useCountdown = (): CountdownHook => {
  const [countdown, setCountdown] = useState<number | null>(null)

  useEffect(() => {
    if (countdown === null || countdown <= 0) {
      return
    }

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev === null || prev <= 1) {
          return null
        }
        return prev - 1
      })
    }, COUNTDOWN_INTERVAL_MILLISECONDS)

    return () => clearInterval(timer)
  }, [countdown])

  const startCountdown = (): void => {
    setCountdown(Math.ceil(TOTAL_COUNTDOWN_MILLISECONDS / COUNTDOWN_INTERVAL_MILLISECONDS))
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

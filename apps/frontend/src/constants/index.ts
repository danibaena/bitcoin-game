import { isDemoMode } from "@/mocks/utils"

export const SHOW_RESULT_MILLISECONDS = 10000

export const TOTAL_POLLING_INTERVAL_MILLISECONDS = 2000

export const TOTAL_COUNTDOWN_MILLISECONDS = !isDemoMode() ? 60000 : 5000
export const COUNTDOWN_INTERVAL_MILLISECONDS = 1000

export const API_URL = "/api"

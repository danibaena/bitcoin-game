import { API_URL } from "@/constants"
import { useQuery } from "@tanstack/react-query"

export type SessionResponse = {
  sesionId: string
  score: string
}

const fetchGetOrCreateSession = async (): Promise<SessionResponse> => {
  try {
    const response = await fetch(`${API_URL}/session`)
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`)
    }
    const data = (await response.json()) as SessionResponse

    return data
  } catch (error) {
    console.error("Error fetching Get or Create Game:", error)
    throw error
  }
}

export const useGetOrCreateSession = () => {
  const { data: session, isLoading: isLoadingSession } = useQuery({
    queryKey: ["getOrCreateSession"],
    queryFn: fetchGetOrCreateSession,
    refetchOnWindowFocus: false,
  })

  return {
    session,
    isLoadingSession,
  }
}

import { API_URL } from "@/constants"
import { useMutation, useQueryClient } from "@tanstack/react-query"

export const useUpdateScore = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (isCorrect: boolean) => {
      const response = await fetch(`${API_URL}/score`, {
        method: "POST",
        body: JSON.stringify(portUpdateScoreDTO(isCorrect)),
      })
      return response
    },
    onSuccess: () => {
      return queryClient.invalidateQueries({ queryKey: ["getOrCreateSession"] })
    },
  }).mutateAsync
}

type UpdateScoreDTO = {
  correct: boolean
}

const portUpdateScoreDTO = (isCorrect: boolean): UpdateScoreDTO => {
  return {
    correct: isCorrect,
  }
}

import { mutateUpdateSettings } from '@nathy/web/server/settings'
import type { Settings } from '@nathy/web/types/settings'
import { type QueryClient, useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'

export const useMutationUpdateSettings = (queryClient: QueryClient) =>
  useMutation({
    mutationFn: (data: Settings) => mutateUpdateSettings(data),
    onMutate: async (data) => {
      await queryClient.cancelQueries({ queryKey: ['settings'] })
      const previousSettings = queryClient.getQueryData<Settings>(['settings'])

      if (!previousSettings) return { previousSettings }

      const optimisticUpdatedSettings = {
        title: data.title,
        theme: data.theme,
        backgroundEffect: data.backgroundEffect
      } satisfies Settings

      queryClient.setQueryData<Settings>(['settings'], (oldSettings) => {
        if (!oldSettings) return oldSettings
        return { ...oldSettings, ...optimisticUpdatedSettings }
      })

      return { previousSettings }
    },
    onError: (_err, _variables, context) => {
      if (context?.previousSettings) {
        queryClient.setQueryData(['settings'], context.previousSettings)
      }
      toast.error('Erro ao atualizar as configurações')
    },
    onSuccess: (updatedSettings) => {
      queryClient.setQueryData<Settings>(['settings'], (oldSettings) => {
        if (!oldSettings) return oldSettings

        return { ...oldSettings, ...updatedSettings }
      })
      toast.success('Configurações atualizadas com sucesso')
    },
  })

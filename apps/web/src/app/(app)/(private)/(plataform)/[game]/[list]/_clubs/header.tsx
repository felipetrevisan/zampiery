'use client'

import { ComboboxField } from '@nathy/shared/ui/combobox'
import { Separator } from '@nathy/shared/ui/separator'
import { BaseHeader } from '@nathy/web/components/base-header'
import type { FormationFormSchema } from '@nathy/web/config/schemas/formation'
import type { Formation } from '@nathy/web/types/formation'
import type { GroupedList } from '@nathy/web/types/grouped-list'
import { useFormContext } from 'react-hook-form'

interface HeaderProps {
  data: GroupedList
  formations: Formation[]
}

export function Header({ data, formations }: HeaderProps) {
  const {
    control,
    formState: { isSubmitting },
  } = useFormContext<FormationFormSchema>()

  return (
    <BaseHeader showTotalCount={false} title={data.clubs?.name ?? ''}>
      <div className="flex items-center gap-2">
        <Separator className="h-6" orientation="vertical" />
        <ComboboxField
          control={control}
          disabled={isSubmitting}
          name="formation"
          options={formations?.map((formation) => {
            return { value: formation.id, label: formation.title }
          })}
          placeholder="Selecione uma formação"
          returnType="string"
        />

        {/* <BlobButton
          onClick={() => {
            onDialogOpen(true)
          }}
          rounded="2xl"
          size="lg"
          type="button"
        >
          Adicionar Novo Jogo
        </BlobButton> */}
      </div>
    </BaseHeader>
  )
}

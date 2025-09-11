import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@nathy/shared/ui/alert-dialog'

interface ConfirmDeleteAlertProps {
  onDelete: (id: string) => void
  deleteId: string | null
  onSetDeleteId: (id: string | null) => void
}

export function ConfirmDeleteAlert({ deleteId, onDelete, onSetDeleteId }: ConfirmDeleteAlertProps) {
  return (
    <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && onSetDeleteId(null)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Tem certeza que deseja excluir?</AlertDialogTitle>
          <AlertDialogDescription>
            Essa ação não pode ser desfeita. Isso irá excluir permanentemente a lista selecionada.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => onSetDeleteId(null)}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              if (deleteId) onDelete(deleteId)
              onSetDeleteId(null)
            }}
            className="bg-primary text-primary-foreground"
          >
            Deletar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

import { Plus, Scissors } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Button, ConfirmDialog, Spinner, Tabs } from '@/components/ui'
import { PageTransition } from '@/components/layout/PageTransition'
import { ProcedureCard } from '@/features/procedures/components/ProcedureCard'
import { ProcedureFormModal } from '@/features/procedures/components/ProcedureFormModal'
import {
  useCreateProcedure,
  useDeleteProcedure,
  useUpdateProcedure,
} from '@/features/procedures/hooks/useProcedureMutations'
import { useProcedures } from '@/features/procedures/hooks/useProcedures'
import type { ProcedureFormValues } from '@/features/procedures/schemas'
import type { Procedure } from '@/features/procedures/types'

const ALL_CATEGORIES = 'all'

export function ProceduresPage() {
  const { data: procedures = [], isLoading } = useProcedures()
  const [categoryFilter, setCategoryFilter] = useState<string>(ALL_CATEGORIES)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingProcedure, setEditingProcedure] = useState<Procedure>()
  const [submitError, setSubmitError] = useState<string>()
  const [pendingDelete, setPendingDelete] = useState<Procedure>()
  const [deleteError, setDeleteError] = useState<string>()

  const createMutation = useCreateProcedure()
  const updateMutation = useUpdateProcedure()
  const deleteMutation = useDeleteProcedure()

  const categories = useMemo(
    () => Array.from(new Set(procedures.map((item) => item.category))).sort(),
    [procedures],
  )

  const tabItems = useMemo(
    () => [
      { value: ALL_CATEGORIES, label: 'Todos' },
      ...categories.map((category) => ({ value: category, label: category })),
    ],
    [categories],
  )

  const activeCategory =
    categoryFilter === ALL_CATEGORIES || categories.includes(categoryFilter)
      ? categoryFilter
      : ALL_CATEGORIES

  const filtered =
    activeCategory === ALL_CATEGORIES
      ? procedures
      : procedures.filter((item) => item.category === activeCategory)

  function openCreateModal() {
    setEditingProcedure(undefined)
    setSubmitError(undefined)
    setModalOpen(true)
  }

  function openEditModal(procedure: Procedure) {
    setEditingProcedure(procedure)
    setSubmitError(undefined)
    setModalOpen(true)
  }

  function closeModal() {
    setModalOpen(false)
    setSubmitError(undefined)
  }

  function handleSubmit(values: ProcedureFormValues) {
    setSubmitError(undefined)
    if (editingProcedure) {
      updateMutation.mutate(
        { id: editingProcedure.id, values },
        {
          onSuccess: closeModal,
          onError: (error) => setSubmitError(error.message),
        },
      )
    } else {
      createMutation.mutate(values, {
        onSuccess: closeModal,
        onError: (error) => setSubmitError(error.message),
      })
    }
  }

  function handleDeleteClick(procedure: Procedure) {
    setDeleteError(undefined)
    setPendingDelete(procedure)
  }

  function handleCancelDelete() {
    setPendingDelete(undefined)
    setDeleteError(undefined)
  }

  function handleConfirmDelete() {
    if (!pendingDelete) return
    deleteMutation.mutate(pendingDelete.id, {
      onSuccess: () => setPendingDelete(undefined),
      onError: (error) => setDeleteError(error.message),
    })
  }

  return (
    <PageTransition>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-xl font-semibold text-neutral-900 dark:text-neutral-50">
            Procedimentos
          </h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            {procedures.length} cadastrado{procedures.length === 1 ? '' : 's'}
          </p>
        </div>
        <Button size="sm" onClick={openCreateModal}>
          <Plus className="size-4" aria-hidden="true" />
          Novo procedimento
        </Button>
      </div>

      {categories.length > 0 && (
        <Tabs
          items={tabItems}
          value={activeCategory}
          onChange={setCategoryFilter}
          className="flex-wrap"
        />
      )}

      {isLoading ? (
        <div className="flex justify-center py-10">
          <Spinner label="Carregando procedimentos" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-10 text-center text-neutral-500 dark:text-neutral-400">
          <Scissors className="size-8" aria-hidden="true" />
          <p>
            {procedures.length === 0
              ? 'Nenhum procedimento cadastrado ainda.'
              : 'Nenhum procedimento encontrado nessa categoria.'}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {filtered.map((procedure) => (
            <ProcedureCard
              key={procedure.id}
              procedure={procedure}
              onEdit={() => openEditModal(procedure)}
              onDelete={() => handleDeleteClick(procedure)}
            />
          ))}
        </div>
      )}

      <ProcedureFormModal
        open={modalOpen}
        onClose={closeModal}
        procedure={editingProcedure}
        onSubmit={handleSubmit}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
        error={submitError}
      />

      <ConfirmDialog
        open={pendingDelete !== undefined}
        title="Excluir procedimento"
        description={`Excluir o procedimento ${pendingDelete?.name}? Essa ação não pode ser desfeita.`}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        isLoading={deleteMutation.isPending}
        error={deleteError}
      />
    </PageTransition>
  )
}

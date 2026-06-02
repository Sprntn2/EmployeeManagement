import { useEffect, useMemo, useState } from 'react'
import { Button } from '../../components/Button'
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver'
import { EmployeeCard } from './EmployeeCard'
import { EmployeeCreateModal } from './EmployeeCreateModal'
import { useDeleteEmployee, useEmployeesInfinite } from './queries'

function flattenPages(data) {
  return (data?.pages ?? []).flatMap((p) => (Array.isArray(p) ? p : []))
}

export function EmployeeDashboard() {
  const [createOpen, setCreateOpen] = useState(false)

  const employeesQuery = useEmployeesInfinite()
  const deleteMutation = useDeleteEmployee()

  const employees = useMemo(() => flattenPages(employeesQuery.data), [employeesQuery.data])

  const { ref: sentinelRef, isIntersecting } = useIntersectionObserver({
    root: null,
    rootMargin: '600px',
    threshold: 0,
  })

  useEffect(() => {
    if (!isIntersecting) return
    if (!employeesQuery.hasNextPage) return
    if (employeesQuery.isFetchingNextPage) return
    employeesQuery.fetchNextPage()
  }, [isIntersecting, employeesQuery])

  return (
    <div className="min-h-full bg-slate-50">
      <EmployeeCreateModal open={createOpen} onClose={() => setCreateOpen(false)} />

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="text-sm font-medium text-slate-500">Employee Management</div>
            <div className="mt-1 text-2xl font-semibold text-slate-900">Dashboard</div>
            <div className="mt-1 text-sm text-slate-600">Infinite scrolling powered by React Query.</div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="secondary" type="button" onClick={() => employeesQuery.refetch()} disabled={employeesQuery.isFetching}>
              Refresh
            </Button>
            <Button type="button" onClick={() => setCreateOpen(true)}>
              Add Employee
            </Button>
          </div>
        </div>

        {employeesQuery.error ? (
          <div className="mt-6 rounded-xl bg-red-50 p-4 text-sm text-red-800 ring-1 ring-red-200">
            {employeesQuery.error.message}
            <div className="mt-1 text-xs text-red-700">
              If this is a HTTPS/self-signed certificate issue, open the API URL once in the browser to trust it.
            </div>
          </div>
        ) : null}

        {employeesQuery.isLoading ? (
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-44 animate-pulse rounded-2xl bg-white ring-1 ring-slate-200" />
            ))}
          </div>
        ) : (
          <>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {employees.map((e) => (
                <EmployeeCard
                  key={e.id}
                  employee={e}
                  deleting={deleteMutation.isPending}
                  onDelete={(id) => deleteMutation.mutate(id)}
                />
              ))}
            </div>

            <div className="mt-6 flex items-center justify-center">
              {employeesQuery.isFetchingNextPage ? (
                <div className="text-sm text-slate-500">Loading more…</div>
              ) : employeesQuery.hasNextPage ? (
                <div ref={sentinelRef} className="h-10 w-full" />
              ) : (
                <div className="text-sm text-slate-500">You’ve reached the end.</div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}


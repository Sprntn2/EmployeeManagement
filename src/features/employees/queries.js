import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createEmployee, deleteEmployee, EMPLOYEES_PAGE_SIZE, getEmployeesPage } from '../../api/employees'

export function employeesQueryKey() {
  return ['employees']
}

export function useEmployeesInfinite() {
  return useInfiniteQuery({
    queryKey: employeesQueryKey(),
    queryFn: ({ pageParam }) =>
      getEmployeesPage({
        pageNumber: pageParam ?? 1,
        pageSize: EMPLOYEES_PAGE_SIZE,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      if (!Array.isArray(lastPage)) return undefined
      return lastPage.length < EMPLOYEES_PAGE_SIZE ? undefined : allPages.length + 1
    },
  })
}

export function useCreateEmployee() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createEmployee,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: employeesQueryKey() })
    },
  })
}

export function useDeleteEmployee() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteEmployee,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: employeesQueryKey() })

      const previous = queryClient.getQueryData(employeesQueryKey())

      queryClient.setQueryData(employeesQueryKey(), (old) => {
        if (!old?.pages) return old
        return {
          ...old,
          pages: old.pages.map((page) => (Array.isArray(page) ? page.filter((e) => e?.id !== id) : page)),
        }
      })

      return { previous }
    },
    onError: (_err, _id, ctx) => {
      if (ctx?.previous) queryClient.setQueryData(employeesQueryKey(), ctx.previous)
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: employeesQueryKey() })
    },
  })
}


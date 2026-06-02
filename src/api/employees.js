import { api } from './api'

export const EMPLOYEES_PAGE_SIZE = 12

// Backend routes (per your working URL):
// GET    /api/Employee?pageNumber=1&pageSize=12
// POST   /api/Employee
// DELETE /api/Employee/{id}
//
// If your backend uses different param names, adjust here only.
const EMPLOYEES_PATH = '/api/Employee'
export async function getEmployeesPage({ pageNumber, pageSize = EMPLOYEES_PAGE_SIZE }) {
  const res = await api.get(EMPLOYEES_PATH, {
    params: {
      pageNumber,
      pageSize,
    },
  })

  // Supports either:
  // - plain array: EmployeeResponseDto[]
  // - wrapped: { items: EmployeeResponseDto[] } or { data: EmployeeResponseDto[] }
  const data = res.data
  const items =
    (Array.isArray(data) && data) ||
    (Array.isArray(data?.items) && data.items) ||
    (Array.isArray(data?.data) && data.data) ||
    []

  return items
}

export async function createEmployee(employeeCreateDto) {
  const res = await api.post(EMPLOYEES_PATH, employeeCreateDto)
  return res.data
}

export async function deleteEmployee(id) {
  await api.delete(`${EMPLOYEES_PATH}/${id}`)
}


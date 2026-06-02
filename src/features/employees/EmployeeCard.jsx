import { roleUi } from '../../lib/roles'
import { Button } from '../../components/Button'

function formatMoney(value) {
  const n = Number(value)
  if (!Number.isFinite(n)) return String(value ?? '-')
  return new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD', maximumFractionDigits: 2 }).format(n)
}

function renderDetail(employee) {
  const role = roleUi(employee?.role).label
  if (role === 'Developer') return `Number of Reports: ${employee?.numberOfReports ?? '-'}`
  if (role === 'QA') return `Bugs Found: ${employee?.bugsFound ?? '-'}`
  if (role === 'Team Lead' || role === 'Project Manager') return `Yearly Bonus: ${formatMoney(employee?.yearlyBonus)}`
  return '-'
}

export function EmployeeCard({ employee, onDelete, deleting }) {
  const ui = roleUi(employee?.role)

  return (
    <div className={`rounded-2xl bg-white p-4 shadow-sm ring-1 ${ui.ring}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="truncate text-sm text-slate-500">Employee #{employee?.id}</div>
          <div className="truncate text-lg font-semibold text-slate-900">{employee?.name}</div>
        </div>
        <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${ui.badge}`}>
          {ui.label}
        </span>
      </div>

      <div className="mt-4 space-y-2 text-sm">
        <div className="flex items-center justify-between gap-3">
          <span className="text-slate-600">Salary</span>
          <span className="font-medium text-slate-900">{formatMoney(employee?.salary)}</span>
        </div>
        <div className="flex items-center justify-between gap-3">
          <span className="text-slate-600">Details</span>
          <span className="text-right font-medium text-slate-900">{renderDetail(employee)}</span>
        </div>
      </div>

      <div className="mt-4 flex justify-end">
        <Button variant="danger" onClick={() => onDelete?.(employee?.id)} disabled={deleting}>
          Delete
        </Button>
      </div>
    </div>
  )
}


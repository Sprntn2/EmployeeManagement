import { useMemo, useState } from 'react'
import { Modal } from '../../components/Modal'
import { Button } from '../../components/Button'
import { Field, Input, Select } from '../../components/Field'
import { roleOptions, Role } from '../../lib/roles'
import { useCreateEmployee } from './queries'

function emptyForm() {
  return {
    name: '',
    salary: '',
    role: String(Role.ProjectManager),
    yearlyBonus: '',
    bugsFound: '',
    numberOfReports: '',
  }
}

function buildCreateDto(form) {
  const role = Number.parseInt(String(form.role), 10)

  const dto = {
    name: form.name.trim(),
    salary: Number(form.salary),
    role,
  }

  if (role === Role.Developer && form.numberOfReports !== '') dto.numberOfReports = Number(form.numberOfReports)
  if (role === Role.QA && form.bugsFound !== '') dto.bugsFound = Number(form.bugsFound)
  if ((role === Role.ProjectManager || role === Role.TeamLead) && form.yearlyBonus !== '')
    dto.yearlyBonus = Number(form.yearlyBonus)

  return dto
}

export function EmployeeCreateModal({ open, onClose }) {
  const [form, setForm] = useState(() => emptyForm())
  const createMutation = useCreateEmployee()

  const errors = useMemo(() => {
    const e = {}
    if (!form.name.trim()) e.name = 'Name is required'
    if (form.salary === '' || !Number.isFinite(Number(form.salary))) e.salary = 'Salary must be a number'

    const role = Number.parseInt(String(form.role), 10)
    if (role === Role.Developer && form.numberOfReports !== '' && !Number.isFinite(Number(form.numberOfReports)))
      e.numberOfReports = 'Must be a number'
    if (role === Role.QA && form.bugsFound !== '' && !Number.isFinite(Number(form.bugsFound))) e.bugsFound = 'Must be a number'
    if ((role === Role.ProjectManager || role === Role.TeamLead) && form.yearlyBonus !== '' && !Number.isFinite(Number(form.yearlyBonus)))
      e.yearlyBonus = 'Must be a number'
    return e
  }, [form])

  const canSubmit = Object.keys(errors).length === 0

  const onSubmit = async (e) => {
    e.preventDefault()
    if (!canSubmit) return

    const dto = buildCreateDto(form)
    await createMutation.mutateAsync(dto)
    setForm(emptyForm())
    onClose?.()
  }

  const role = Number.parseInt(String(form.role), 10)

  return (
    <Modal
      open={open}
      title="Add employee"
      description="Creates a polymorphic TPH employee record based on the selected role."
      onClose={() => {
        if (createMutation.isPending) return
        onClose?.()
      }}
      footer={
        <div className="flex items-center justify-end gap-2">
          <Button
            variant="secondary"
            type="button"
            onClick={() => onClose?.()}
            disabled={createMutation.isPending}
          >
            Cancel
          </Button>
          <Button type="submit" form="create-employee-form" disabled={!canSubmit || createMutation.isPending}>
            {createMutation.isPending ? 'Saving…' : 'Create'}
          </Button>
        </div>
      }
    >
      <form id="create-employee-form" className="space-y-4" onSubmit={onSubmit}>
        {createMutation.error ? (
          <div className="rounded-lg bg-red-50 p-3 text-sm text-red-800 ring-1 ring-red-200">
            {createMutation.error.message}
          </div>
        ) : null}

        <Field label="Name" error={errors.name}>
          <Input
            value={form.name}
            onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
            placeholder="e.g. Alex Johnson"
          />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Role">
            <Select value={form.role} onChange={(e) => setForm((p) => ({ ...p, role: e.target.value }))}>
              {roleOptions.map((opt) => (
                <option key={opt.value} value={String(opt.value)}>
                  {opt.label}
                </option>
              ))}
            </Select>
          </Field>

          <Field label="Salary" error={errors.salary} hint="Decimal allowed">
            <Input
              type="number"
              inputMode="decimal"
              value={form.salary}
              onChange={(e) => setForm((p) => ({ ...p, salary: e.target.value }))}
              placeholder="e.g. 4500"
            />
          </Field>
        </div>

        {role === Role.Developer ? (
          <Field label="Number of Reports" error={errors.numberOfReports} hint="Only for Developer (1)">
            <Input
              type="number"
              inputMode="numeric"
              value={form.numberOfReports}
              onChange={(e) => setForm((p) => ({ ...p, numberOfReports: e.target.value }))}
              placeholder="e.g. 3"
            />
          </Field>
        ) : null}

        {role === Role.QA ? (
          <Field label="Bugs Found" error={errors.bugsFound} hint="Only for QA (2)">
            <Input
              type="number"
              inputMode="numeric"
              value={form.bugsFound}
              onChange={(e) => setForm((p) => ({ ...p, bugsFound: e.target.value }))}
              placeholder="e.g. 12"
            />
          </Field>
        ) : null}

        {role === Role.ProjectManager || role === Role.TeamLead ? (
          <Field label="Yearly Bonus" error={errors.yearlyBonus} hint="Only for ProjectManager (0) / TeamLead (3)">
            <Input
              type="number"
              inputMode="decimal"
              value={form.yearlyBonus}
              onChange={(e) => setForm((p) => ({ ...p, yearlyBonus: e.target.value }))}
              placeholder="e.g. 1000"
            />
          </Field>
        ) : null}
      </form>
    </Modal>
  )
}


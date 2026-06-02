export const Role = {
  // NOTE:
  // Your server behavior indicates 0 maps to Developer.
  // So we align client enum values to the backend's actual mapping.
  Developer: 0,
  ProjectManager: 1,
  QA: 2,
  TeamLead: 3,
}

export const roleOptions = [
  { label: 'Project Manager', value: Role.ProjectManager },
  { label: 'Developer', value: Role.Developer },
  { label: 'QA', value: Role.QA },
  { label: 'Team Lead', value: Role.TeamLead },
]

export function normalizeRole(role) {
  // Backend might return enum as string or int.
  if (typeof role === 'number') {
    return Object.keys(Role).find((k) => Role[k] === role) ?? String(role)
  }

  if (typeof role === 'string') {
    // normalize common labels/spaces
    const clean = role.replace(/\s+/g, '').trim()
    if (!clean) return role
    if (clean.toLowerCase() === 'projectmanager') return 'ProjectManager'
    if (clean.toLowerCase() === 'teamlead') return 'TeamLead'
    if (clean.toLowerCase() === 'developer') return 'Developer'
    if (clean.toLowerCase() === 'qa') return 'QA'
    return clean
  }

  return 'Unknown'
}

export function roleUi(role) {
  const r = normalizeRole(role)
  switch (r) {
    case 'ProjectManager':
      return { label: 'Project Manager', ring: 'ring-red-500/40', badge: 'bg-red-500/10 text-red-700 ring-red-500/20' }
    case 'Developer':
      return { label: 'Developer', ring: 'ring-blue-500/40', badge: 'bg-blue-500/10 text-blue-700 ring-blue-500/20' }
    case 'QA':
      return { label: 'QA', ring: 'ring-green-500/40', badge: 'bg-green-500/10 text-green-700 ring-green-500/20' }
    case 'TeamLead':
      return { label: 'Team Lead', ring: 'ring-purple-500/40', badge: 'bg-purple-500/10 text-purple-700 ring-purple-500/20' }
    default:
      return { label: String(r), ring: 'ring-slate-400/40', badge: 'bg-slate-500/10 text-slate-700 ring-slate-500/20' }
  }
}


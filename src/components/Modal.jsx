import { useEffect } from 'react'

export function Modal({ open, title, description, onClose, children, footer }) {
  useEffect(() => {
    if (!open) return

    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose?.()
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40" onClick={() => onClose?.()} />
      <div className="absolute inset-0 overflow-y-auto p-4 sm:p-8">
        <div className="mx-auto w-full max-w-xl rounded-2xl bg-white shadow-xl ring-1 ring-slate-200">
          <div className="p-5 sm:p-6">
            <div className="space-y-1">
              <div className="text-lg font-semibold text-slate-900">{title}</div>
              {description ? <div className="text-sm text-slate-600">{description}</div> : null}
            </div>
            <div className="mt-5">{children}</div>
          </div>
          {footer ? <div className="border-t border-slate-200 bg-slate-50 p-4 sm:p-5">{footer}</div> : null}
        </div>
      </div>
    </div>
  )
}


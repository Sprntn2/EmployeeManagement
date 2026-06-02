import { useEffect, useRef, useState } from 'react'

export function useIntersectionObserver(options) {
  const ref = useRef(null)
  const [isIntersecting, setIsIntersecting] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    const observer = new IntersectionObserver(([entry]) => setIsIntersecting(entry.isIntersecting), options)
    observer.observe(node)
    return () => observer.disconnect()
  }, [options])

  return { ref, isIntersecting }
}


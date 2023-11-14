import { useEffect, useState } from 'react'

export default function useScrollPosition() {
  const [scrollData, setScrollData] = useState<
    [number, 'none' | 'up' | 'down']
  >([0, 'none'])

  const handleScroll = () => {
    setScrollData((c) => [
      window.scrollY,
      window.scrollY - c[0] >= 0 ? 'down' : 'up',
    ])
  }

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return scrollData
}

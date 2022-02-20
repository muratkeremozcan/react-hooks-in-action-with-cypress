import { useEffect, useState } from 'react'

const getSize = () => ({
  width: window.innerWidth,
  height: window.innerHeight
})

export default function useWindowSize() {
  const [size, setSize] = useState(getSize)

  useEffect(() => {
    const handleResize = () => setSize(getSize)

    window.addEventListener('resize', handleResize)

    handleResize()

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // [9.4] identify what the component render needs - we want it dumb as possible - an return that
  return size
}

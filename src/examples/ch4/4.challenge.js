import { useState, useEffect } from 'react'

export default function Challenge() {
  const getSize = () => ({
    width: window.innerWidth,
    height: window.innerHeight
  })

  const getMeasure = (width) => {
    let measurement

    if (width < 400) {
      measurement = 'small'
    } else if (width >= 400 && width < 800) {
      measurement = 'medium'
    } else {
      measurement = 'large'
    }
    return measurement
  }

  const [size, setSize] = useState(getSize)
  const [measure, setMeasure] = useState(getMeasure(size.width))

  useEffect(() => {
    const handleResize = () => setSize(getSize)
    const handleReMeasure = () => setMeasure(getMeasure())
    console.log(getSize)

    window.addEventListener('resize', handleResize)
    window.addEventListener('resize', handleReMeasure)

    document.title = measure

    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('resize', handleReMeasure)
    }
  }, [size, measure])

  return (
    <p>
      {size.width} {measure}
    </p>
  )
}

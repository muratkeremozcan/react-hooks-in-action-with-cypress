import { useState, useEffect } from 'react'

export default function WindowSize() {
  const getSize = () => ({
    width: window.innerWidth,
    height: window.innerHeight
  })

  // from (2.1)
  // note: the useState hook also accepts a function as its argument, a lazy initial state
  // Use the lazy initial state if you need to undertake expensive work to generate an initial value
  const [size, setSize] = useState(getSize)

  // [4.1]
  // React determines whether to run an effect by checking if the values in the list have changed since the last time the component called the effect.
  // By setting the list to an empty array, the list will never change, and we cause the effect to run only once, when the component first mounts.
  // TL, DR; if it's an empty array, the effect function runs only once
  // TL, DR; This is how the 2nd arg to useEffect can be used for memoization
  /// if a change happens to the 2nd arg then we will run our useEffect function, otherwise we won't
  useEffect(() => {
    const handleResize = () => setSize(getSize)

    window.addEventListener('resize', handleResize)

    // [4.2] the useEffect hook incorporates a simple mechanism for cleaning up our effects.
    // Just return a function from the effect. React runs the returned function when it’s time to tidy up.
    return () => window.removeEventListener('resize', handleResize)
  }, [])
  // empty array because we want the effect to to run only once; add event listener, setSize and remove it

  return (
    <p>
      Width: {size.width}, Height: {size.height}
    </p>
  )
}

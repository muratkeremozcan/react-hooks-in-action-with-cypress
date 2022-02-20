import useWindowSize from './use-window-size'

export default function WindowSize() {
  // [9.5] destructure as needed
  const { width, height } = useWindowSize()

  return (
    <p>
      Width: {width}, Height: {height}
    </p>
  )
}

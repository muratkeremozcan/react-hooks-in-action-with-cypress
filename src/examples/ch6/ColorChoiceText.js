// [5.0.1] child components destructure and use the props
export default function ColorChoiceText({ color }) {
  return color ? (
    <p>The selected color is {color}</p>
  ) : (
    <p>No color has been selected</p>
  )
}

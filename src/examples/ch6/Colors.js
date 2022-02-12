import { useState } from 'react'

import ColorPicker from './ColorPicker'
import ColorChoiceText from './ColorChoiceText'
import ColorSample from './ColorSample'

export default function Colors() {
  // [6.0] when components use the same data to build their UI,
  // share that data by passing it as a prop from parent to children
  /// (here the parent passes 2 props to the children)
  const availableColors = ['skyblue', 'goldenrod', 'teal', 'coral']
  const [color, setColor] = useState(availableColors[0])

  return (
    <div className="colors">
      <ColorPicker colors={availableColors} color={color} setColor={setColor} />
      <ColorChoiceText color={color} />
      <ColorSample color={color} />
    </div>
  )
}

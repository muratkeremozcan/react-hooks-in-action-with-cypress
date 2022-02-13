// [6.0.1] child components destructure and use the props
export default function ColorPicker({ colors = [], color, setColor }) {
  return (
    <ul>
      {colors.map((c, i) => (
        <li
          key={i}
          className={color === c ? 'selected' : null}
          style={{ background: c }}
          onClick={() => setColor(c)}
          data-cy={`${c}-${i}`}
        >
          {c}
        </li>
      ))}
    </ul>
  )
}

export default function ColorSample({ color }) {
  return color ? (
    <div
      className="colorSample"
      style={{ background: color }}
      data-cy="color-sample"
    />
  ) : null
}

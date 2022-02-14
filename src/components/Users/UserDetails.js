// [6.0.1] child components destructure and use the props

export default function UserDetails({ user }) {
  // todo: add note from summary
  return user ? (
    <div data-cy="user-details" className="item user">
      <div className="item-header">
        <h2>{user.name}</h2>
      </div>
      <div className="user-details">
        <h3>{user.title}</h3>
        <p>{user.notes}</p>
      </div>
    </div>
  ) : null
}

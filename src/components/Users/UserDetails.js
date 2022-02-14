// [6.2] child components destructure and use the props

export default function UserDetails({ user }) {
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
  // [6.3] Check for undefined or null prop values. Return alternative UI if appropriate
}

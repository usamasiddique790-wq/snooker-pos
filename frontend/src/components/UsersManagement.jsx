function UsersManagement({
  users,
  newUser,
  setNewUser,
  createUser,
  editingUser,
  editUserForm,
  setEditUserForm,
  updateUser,
  setEditingUser,
  startEditUser,
  deleteUser,
}) {
  return (
    <>
      <form className="user-form" onSubmit={createUser}>
        <input
          type="text"
          placeholder="Username"
          value={newUser.username}
          onChange={(e) =>
            setNewUser({ ...newUser, username: e.target.value })
          }
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={newUser.password}
          onChange={(e) =>
            setNewUser({ ...newUser, password: e.target.value })
          }
          required
        />

        <select
          value={newUser.role}
          onChange={(e) =>
            setNewUser({ ...newUser, role: e.target.value })
          }
        >
          <option value="cashier">Cashier</option>
          <option value="staff">Staff</option>
          <option value="admin">Admin</option>
        </select>

        <button type="submit">Create User</button>
      </form>

      {editingUser && (
        <form className="user-form edit-form" onSubmit={updateUser}>
          <input
            type="text"
            placeholder="Username"
            value={editUserForm.username}
            onChange={(e) =>
              setEditUserForm({
                ...editUserForm,
                username: e.target.value,
              })
            }
            required
          />

          <input
            type="password"
            placeholder="New password"
            value={editUserForm.password}
            onChange={(e) =>
              setEditUserForm({
                ...editUserForm,
                password: e.target.value,
              })
            }
          />

          <select
            value={editUserForm.role}
            onChange={(e) =>
              setEditUserForm({
                ...editUserForm,
                role: e.target.value,
              })
            }
          >
            <option value="cashier">Cashier</option>
            <option value="staff">Staff</option>
            <option value="admin">Admin</option>
          </select>

          <button type="submit">Save Changes</button>

          <button type="button" onClick={() => setEditingUser(null)}>
            Cancel
          </button>
        </form>
      )}

      <div className="users-table">
        {users.map((item) => (
          <div className="user-row" key={item.id}>
            <span>{item.username}</span>
            <strong>{item.role}</strong>

            <button
              className="edit-user-btn"
              onClick={() => startEditUser(item)}
            >
              Edit
            </button>

            {item.role !== "admin" && (
              <button
                className="delete-user-btn"
                onClick={() => deleteUser(item.id)}
              >
                Delete
              </button>
            )}
          </div>
        ))}
      </div>
    </>
  );
}

export default UsersManagement;
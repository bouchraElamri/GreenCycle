import useUsers from "../../../hooks/useUsers";

const formatDate = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString();
};

const roleLabel = (role) => {
  if (Array.isArray(role)) return role.join(", ");
  return role || "-";
};

export default function UserList() {
  const {
    users,
    pagination,
    q,
    setQ,
    setPage,
    setLimit,
    loading,
    error,
  } = useUsers();

  return (
    <section className="w-full font-nexa">
      <h1 className="mb-6 text-5xl font-black text-gray">Users</h1>

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <input
          type="text"
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setPage(1);
          }}
          placeholder="Search by name, email, phone..."
          className="h-11 w-full max-w-md rounded-full border border-white-broken bg-white-intense px-4 text-gray outline-none focus:border-green-tolerated"
        />

        <select
          value={pagination.limit}
          onChange={(e) => setLimit(e.target.value)}
          className="h-11 rounded-full border border-white-broken bg-white-intense px-4 text-gray outline-none focus:border-green-tolerated"
        >
          <option value={5}>5 / page</option>
          <option value={10}>10 / page</option>
          <option value={20}>20 / page</option>
        </select>
      </div>

      {loading && <p className="p-4 text-gray">Loading users...</p>}
      {error && !loading && <p className="p-4 text-red">{error}</p>}

      {!loading && !error && (
        <>
          <div className="overflow-x-auto rounded-2xl border border-white-broken bg-white-intense">
            <table className="w-full min-w-[760px] text-left">
              <thead className="bg-green-light/35 text-gray">
                <tr>
                  <th className="px-4 py-3 text-sm font-bold">Full Name</th>
                  <th className="px-4 py-3 text-sm font-bold">Email</th>
                  <th className="px-4 py-3 text-sm font-bold">Phone</th>
                  <th className="px-4 py-3 text-sm font-bold">Role</th>
                  <th className="px-4 py-3 text-sm font-bold">Joined At</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td className="px-4 py-4 text-gray" colSpan={5}>
                      No users found.
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user._id} className="border-t border-white-broken/80">
                      <td className="px-4 py-3 text-gray">
                        {[user.firstName, user.lastName].filter(Boolean).join(" ") || "-"}
                      </td>
                      <td className="px-4 py-3 text-gray">{user.email || "-"}</td>
                      <td className="px-4 py-3 text-gray">{user.phone || "-"}</td>
                      <td className="px-4 py-3 text-gray">{roleLabel(user.role)}</td>
                      <td className="px-4 py-3 text-gray">{formatDate(user.createdAt)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex items-center justify-between gap-3">
            <p className="text-sm text-gray">
              Page {pagination.page} / {Math.max(pagination.totalPages || 1, 1)} - Total {pagination.total || 0}
            </p>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPage(Math.max(1, pagination.page - 1))}
                disabled={pagination.page <= 1}
                className="rounded-full border border-green-tolerated px-4 py-2 text-sm font-bold text-green-dark disabled:cursor-not-allowed disabled:opacity-40"
              >
                Previous
              </button>
              <button
                type="button"
                onClick={() => setPage(Math.min(pagination.totalPages || 1, pagination.page + 1))}
                disabled={pagination.page >= (pagination.totalPages || 1)}
                className="rounded-full border border-green-tolerated px-4 py-2 text-sm font-bold text-green-dark disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}
    </section>
  );
}

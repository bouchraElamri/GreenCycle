import useUsers from "../../../hooks/useUsers";
import Pagination from "../../../components/common/Pagination";

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
    loading,
    error,
  } = useUsers();

  return (
    <section className="w-full font-nexa">
      <h1 className="mb-5 text-4xl font-black text-gray sm:mb-6 sm:text-5xl">Users</h1>

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <input
          type="text"
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setPage(1);
          }}
          placeholder="Search by name, email, phone..."
          className="h-11 w-full rounded-full border border-white-broken bg-white-intense px-4 text-gray outline-none focus:border-green-tolerated sm:max-w-md"
        />
      </div>

      {loading && <p className="p-4 text-gray">Loading users...</p>}
      {error && !loading && <p className="p-4 text-red">{error}</p>}

      {!loading && !error && (
        <>
          <div className="overflow-x-auto rounded-2xl border border-white-broken bg-white-intense">
            <table className="w-full min-w-[700px] text-left sm:min-w-[760px]">
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

          {Math.max(pagination.totalPages || 0, 0) > 1 && (
            <Pagination
              currentPage={pagination.page}
              setCurrentPage={setPage}
              totalPages={pagination.totalPages}
            />
          )}

        </>
      )}
    </section>
  );
}

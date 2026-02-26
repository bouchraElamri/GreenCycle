export default function ProductListHeader({ query, setQuery, onRefresh }) {
  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:justify-between">
        <h2 className="text-2xl font-bold text-green-dark">Your Products</h2>
        <button
          type="button"
          className="rounded-xl border border-green-medium text-green-medium px-4 py-2 font-bold"
          onClick={onRefresh}
        >
          Refresh
        </button>
      </div>

      <input
        type="text"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search in your products..."
        className="mt-4 w-full rounded-xl border border-green-light px-3 py-2"
      />
    </>
  );
}

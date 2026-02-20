import React, { memo, useMemo } from 'react'

function Pagination({ currentPage, setCurrentPage, totalPages }) {
  const pages = useMemo(
    () => Array.from({ length: totalPages }, (_, i) => i + 1),
    [totalPages]
  );

  return (
    <div className="mt-8 flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  className="w-7 h-7 rounded-md bg-green-dark text-white-intense disabled:opacity-40"
                >
                  {"<"}
                </button>

                {pages.map((page) => (
                  <button
                    key={page}
                    type="button"
                    onClick={() => setCurrentPage(page)}
                    className={`w-7 h-7 rounded-full text-xs font-nexa border ${
                      currentPage === page
                        ? "bg-green-dark text-white-intense border-green-dark"
                        : "bg-white-intense text-green-dark border-green-dark/40"
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="w-7 h-7 rounded-md bg-green-dark text-white-intense disabled:opacity-40"
                >
                  {">"}
                </button>
              </div>
  )
}

export default memo(Pagination);


function Table({ columns = [], data = [], emptyMessage = "No data available" }) {
  return (
    <div className="w-full overflow-x-auto rounded-lg border border-gray-200">
      <table className="w-full text-left">
        <thead className="bg-gray-100">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className="px-4 py-3 text-sm font-semibold text-gray-700"
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-200">
          {data.length > 0 ? (
            data.map((row, index) => (
              <tr key={row.id ?? index} className="hover:bg-gray-50">
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className="px-4 py-3 text-sm text-gray-600"
                  >
                    {row[column.key]}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={columns.length || 1}
                className="px-4 py-8 text-center text-gray-500"
              >
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Table;
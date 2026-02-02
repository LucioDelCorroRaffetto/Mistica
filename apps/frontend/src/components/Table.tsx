import React from "react";
import "./Table.css";

export interface TableColumn<T> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  render?: (value: any, row: T) => React.ReactNode;
}

export interface TableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  striped?: boolean;
  bordered?: boolean;
  compact?: boolean;
  sortBy?: keyof T;
  sortOrder?: "asc" | "desc";
  onSort?: (column: keyof T, order: "asc" | "desc") => void;
  rowKey?: keyof T | string;
}

export default function Table<T extends Record<string, any>>({
  data,
  columns,
  striped = true,
  bordered = false,
  compact = false,
  sortBy,
  sortOrder = "asc",
  onSort,
  rowKey = "id",
}: TableProps<T>) {
  const handleSort = (key: keyof T) => {
    if (onSort) {
      const newOrder =
        sortBy === key && sortOrder === "asc" ? "desc" : "asc";
      onSort(key, newOrder);
    }
  };

  const getRowKey = (row: T, index: number) => {
    if (typeof rowKey === "string") {
      return rowKey + index;
    }
    return String(row[rowKey as keyof T] || index);
  };

  return (
    <div className="table-wrapper">
      <table
        className={`
          ${striped ? "striped" : ""}
          ${bordered ? "bordered" : ""}
          ${compact ? "compact" : ""}
        `.trim()}
      >
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={String(col.key)}
                onClick={() => col.sortable && handleSort(col.key)}
                className={col.sortable ? "sortable" : ""}
                title={col.sortable ? "Click to sort" : ""}
              >
                <div className="th-content">
                  {col.label}
                  {col.sortable && sortBy === col.key && (
                    <span className={`sort-icon ${sortOrder}`}>
                      {sortOrder === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr className="empty-row">
              <td colSpan={columns.length}>No hay datos para mostrar</td>
            </tr>
          ) : (
            data.map((row, index) => (
              <tr key={getRowKey(row, index)}>
                {columns.map((col) => (
                  <td key={String(col.key)}>
                    {col.render
                      ? col.render(row[col.key], row)
                      : String(row[col.key] || "")}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

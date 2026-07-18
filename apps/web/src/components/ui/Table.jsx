import { cn } from '../../lib/cn.js';

export function Table({ columns, data, rowKey = 'id', empty = 'No records found.' }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-100 dark:border-white/10">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/60 text-xs uppercase tracking-wide text-slate-400 dark:border-white/10 dark:bg-white/[0.02]">
              {columns.map((c) => (
                <th key={c.key} className={cn('px-4 py-3 font-semibold', c.className)}>{c.header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-10 text-center text-slate-400">{empty}</td>
              </tr>
            ) : (
              data.map((row) => (
                <tr key={row[rowKey]} className="border-b border-slate-50 transition last:border-0 hover:bg-slate-50/60 dark:border-white/5 dark:hover:bg-white/[0.02]">
                  {columns.map((c) => (
                    <td key={c.key} className={cn('px-4 py-3 align-middle', c.className)}>
                      {c.render ? c.render(row) : row[c.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

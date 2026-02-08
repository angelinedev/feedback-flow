import React, { useState } from 'react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Pencil, Trash2, Plus, Check, X, Search } from 'lucide-react';

interface DataTableProps<T extends Record<string, string>> {
  data: T[];
  columns: { key: keyof T; label: string }[];
  onUpdate: (data: T[]) => void;
  emptyRow: T;
}

function DataTable<T extends Record<string, string>>({ data, columns, onUpdate, emptyRow }: DataTableProps<T>) {
  const [editIdx, setEditIdx] = useState<number | null>(null);
  const [editRow, setEditRow] = useState<T | null>(null);
  const [addingRow, setAddingRow] = useState<T | null>(null);
  const [search, setSearch] = useState('');

  const filtered = data.filter(row =>
    Object.values(row).some(v => String(v).toLowerCase().includes(search.toLowerCase()))
  );

  const startEdit = (idx: number) => {
    setEditIdx(idx);
    setEditRow({ ...data[idx] });
    setAddingRow(null);
  };

  const saveEdit = () => {
    if (editIdx === null || !editRow) return;
    const updated = [...data];
    updated[editIdx] = editRow;
    onUpdate(updated);
    setEditIdx(null);
    setEditRow(null);
  };

  const deleteRow = (idx: number) => {
    onUpdate(data.filter((_, i) => i !== idx));
  };

  const startAdd = () => {
    setAddingRow({ ...emptyRow });
    setEditIdx(null);
    setEditRow(null);
  };

  const saveAdd = () => {
    if (!addingRow) return;
    onUpdate([...data, addingRow]);
    setAddingRow(null);
  };

  // Find the actual index in the full data array for a filtered row
  const getDataIndex = (filteredIdx: number) => {
    const row = filtered[filteredIdx];
    return data.indexOf(row);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9 bg-secondary border-border h-9 text-sm"
          />
        </div>
        <button
          onClick={startAdd}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" /> Add Row
        </button>
      </div>

      <div className="rounded-xl border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-secondary/50">
              {columns.map(col => (
                <TableHead key={String(col.key)} className="text-xs font-semibold text-muted-foreground">
                  {col.label}
                </TableHead>
              ))}
              <TableHead className="w-20 text-xs font-semibold text-muted-foreground">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((row, fIdx) => {
              const dataIdx = getDataIndex(fIdx);
              const isEditing = editIdx === dataIdx;
              return (
                <TableRow key={fIdx} className="border-border">
                  {columns.map(col => (
                    <TableCell key={String(col.key)} className="py-2 px-4">
                      {isEditing ? (
                        <Input
                          value={String(editRow?.[col.key] || '')}
                          onChange={e => setEditRow(prev => prev ? { ...prev, [col.key]: e.target.value } : prev)}
                          className="h-8 text-xs bg-background border-border"
                        />
                      ) : (
                        <span className="text-sm text-foreground">{String(row[col.key])}</span>
                      )}
                    </TableCell>
                  ))}
                  <TableCell className="py-2 px-4">
                    {isEditing ? (
                      <div className="flex gap-1">
                        <button onClick={saveEdit} className="p-1 rounded hover:bg-teal/20 text-teal"><Check className="w-4 h-4" /></button>
                        <button onClick={() => { setEditIdx(null); setEditRow(null); }} className="p-1 rounded hover:bg-destructive/20 text-destructive"><X className="w-4 h-4" /></button>
                      </div>
                    ) : (
                      <div className="flex gap-1">
                        <button onClick={() => startEdit(dataIdx)} className="p-1 rounded hover:bg-primary/20 text-primary"><Pencil className="w-3.5 h-3.5" /></button>
                        <button onClick={() => deleteRow(dataIdx)} className="p-1 rounded hover:bg-destructive/20 text-destructive"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
            {addingRow && (
              <TableRow className="border-border bg-primary/5">
                {columns.map(col => (
                  <TableCell key={String(col.key)} className="py-2 px-4">
                    <Input
                      placeholder={col.label}
                      value={String(addingRow[col.key] || '')}
                      onChange={e => setAddingRow(prev => prev ? { ...prev, [col.key]: e.target.value } : prev)}
                      className="h-8 text-xs bg-background border-border"
                    />
                  </TableCell>
                ))}
                <TableCell className="py-2 px-4">
                  <div className="flex gap-1">
                    <button onClick={saveAdd} className="p-1 rounded hover:bg-teal/20 text-teal"><Check className="w-4 h-4" /></button>
                    <button onClick={() => setAddingRow(null)} className="p-1 rounded hover:bg-destructive/20 text-destructive"><X className="w-4 h-4" /></button>
                  </div>
                </TableCell>
              </TableRow>
            )}
            {filtered.length === 0 && !addingRow && (
              <TableRow>
                <TableCell colSpan={columns.length + 1} className="text-center py-8 text-muted-foreground text-sm">
                  No records found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <p className="text-xs text-muted-foreground">{data.length} total records</p>
    </div>
  );
}

export default DataTable;

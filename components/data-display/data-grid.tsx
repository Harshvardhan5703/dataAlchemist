'use client';

import { useState, useRef, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { AlertTriangle, CheckCircle, Edit3, Save, X, FileText } from 'lucide-react';
import { EntityData, ValidationError, DataType } from '@/types/data-types';
import { cn } from '@/lib/utils';

interface DataGridProps {
  data: EntityData[];
  type: DataType;
  onDataChange: (data: EntityData[]) => void;
  validationErrors: ValidationError[];
}

export function DataGrid({ data, type, onDataChange, validationErrors }: DataGridProps) {
  const [editingCell, setEditingCell] = useState<{ row: number; field: string } | null>(null);
  const [editValue, setEditValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingCell && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editingCell]);

  const getColumns = (): string[] => {
    if (data.length === 0) return [];
    return Object.keys(data[0]);
  };

  const getCellError = (rowIndex: number, field: string): ValidationError | undefined => {
    return validationErrors.find(error => error.row === rowIndex && error.field === field);
  };

  const getRowErrors = (rowIndex: number): ValidationError[] => {
    return validationErrors.filter(error => error.row === rowIndex);
  };

  const handleCellClick = (rowIndex: number, field: string, currentValue: any) => {
    setEditingCell({ row: rowIndex, field });
    setEditValue(String(currentValue));
  };

  const handleCellSave = () => {
    if (!editingCell) return;

    const newData = [...data];
    const { row, field } = editingCell;
    
    // Convert value to appropriate type
    let newValue: any = editValue;
    if (field === 'PriorityLevel' || field === 'Duration' || field === 'MaxLoadPerPhase' || field === 'MaxConcurrent') {
      newValue = parseInt(editValue) || 0;
    }
    
    (newData[row] as any)[field] = newValue;
    onDataChange(newData);
    setEditingCell(null);
  };

  const handleCellCancel = () => {
    setEditingCell(null);
    setEditValue('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCellSave();
    } else if (e.key === 'Escape') {
      handleCellCancel();
    }
  };

  if (data.length === 0) {
    return (
      <div className="text-center py-8 text-slate-500">
        <FileText className="h-12 w-12 mx-auto mb-4 text-slate-300" />
        <p>No data uploaded yet. Please upload a file to begin.</p>
      </div>
    );
  }

  const columns = getColumns();

  return (
    <TooltipProvider>
      <div className="border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50">
                <TableHead className="w-12">#</TableHead>
                {columns.map((column) => (
                  <TableHead key={column} className="font-semibold">
                    {column}
                  </TableHead>
                ))}
                <TableHead className="w-16">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((row, rowIndex) => {
                const rowErrors = getRowErrors(rowIndex);
                const hasErrors = rowErrors.length > 0;

                return (
                  <TableRow
                    key={rowIndex}
                    className={cn(
                      'hover:bg-slate-50 transition-colors',
                      hasErrors && 'bg-red-50/50'
                    )}
                  >
                    <TableCell className="font-medium text-slate-500">
                      {rowIndex + 1}
                    </TableCell>
                    {columns.map((column) => {
                      const cellValue = (row as any)[column];
                      const cellError = getCellError(rowIndex, column);
                      const isEditing = editingCell?.row === rowIndex && editingCell?.field === column;

                      return (
                        <TableCell
                          key={column}
                          className={cn(
                            'relative group cursor-pointer',
                            cellError && 'bg-red-100 border border-red-200',
                            isEditing && 'p-0'
                          )}
                          onClick={() => !isEditing && handleCellClick(rowIndex, column, cellValue)}
                        >
                          {isEditing ? (
                            <div className="flex items-center space-x-1 p-2">
                              <Input
                                ref={inputRef}
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                                onKeyDown={handleKeyDown}
                                className="h-8 text-sm"
                              />
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={handleCellSave}
                                className="h-8 w-8 p-0"
                              >
                                <Save className="h-3 w-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={handleCellCancel}
                                className="h-8 w-8 p-0"
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          ) : (
                            <div className="flex items-center justify-between">
                              <span className="truncate max-w-[200px]">{String(cellValue)}</span>
                              {cellError && (
                                <Tooltip>
                                  <TooltipTrigger>
                                    <AlertTriangle className="h-4 w-4 text-red-500 flex-shrink-0 ml-2" />
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p className="max-w-xs">{cellError.message}</p>
                                    {cellError.suggestion && (
                                      <p className="mt-1 text-blue-300">
                                        Suggestion: {cellError.suggestion}
                                      </p>
                                    )}
                                  </TooltipContent>
                                </Tooltip>
                              )}
                              <Edit3 className="h-3 w-3 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity ml-2" />
                            </div>
                          )}
                        </TableCell>
                      );
                    })}
                    <TableCell>
                      {hasErrors ? (
                        <Tooltip>
                          <TooltipTrigger>
                            <Badge variant="destructive" className="text-xs">
                              {rowErrors.length} error{rowErrors.length > 1 ? 's' : ''}
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent>
                            <div className="space-y-1">
                              {rowErrors.map((error, idx) => (
                                <p key={idx} className="text-xs">
                                  {error.field}: {error.message}
                                </p>
                              ))}
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      ) : (
                        <Badge variant="secondary" className="text-xs">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Valid
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>
    </TooltipProvider>
  );
}
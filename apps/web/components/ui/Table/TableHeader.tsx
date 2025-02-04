import React from 'react'
import { motion } from 'framer-motion'
import { ChevronUp, ChevronDown, ChevronRight, ChevronLeft } from 'lucide-react'
import { Resizable } from '../Resizable'
import { TableColumn } from './types'
import { StatusDropdown } from '@/components/PatientDashboard/filters/StatusDropdown'
import { PriorityDropdown } from '@/components/PatientDashboard/filters/PriorityDropdown'
import { SpecialtyDropdown } from '@/components/PatientDashboard/filters/SpecialtyDropdown'

interface TableHeaderProps<T> {
    columns: TableColumn<T>[]
    sortColumn: string | null
    sortDirection: 'asc' | 'desc'
    expandedColumns: string[]
    columnWidths: { [key: string]: number }
    handleSort: (column: string) => void
    toggleColumnExpansion: (column: string) => void
    toggleAllColumns: () => void
    handleColumnResize: (columnKey: string, width: number) => void
    headerBackgroundColor: string
    headerTextColor: string
    stickyHeader: boolean
    filters: {[key: string]: any}
    onFilterChange: (key: string, value: any) => void
}

export function TableHeader<T>({
                                   columns,
                                   sortColumn,
                                   sortDirection,
                                   expandedColumns,
                                   columnWidths,
                                   handleSort,
                                   toggleColumnExpansion,
                                   toggleAllColumns,
                                   handleColumnResize,
                                   headerBackgroundColor,
                                   headerTextColor,
                                   stickyHeader,
                                   filters,
                                   onFilterChange,
                               }: TableHeaderProps<T>) {
    const renderHeaderCell = (column: TableColumn<T>) => {
        const content = (
            <motion.div
                className="flex items-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                {column.hidden ? (
                    <button
                        onClick={() => toggleColumnExpansion(column.key.toString())}
                        className="flex items-center focus:outline-none group relative"
                        title={column.header}
                    >
                        <motion.div
                            animate={{ rotate: expandedColumns.includes(column.key.toString()) ? 90 : 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <ChevronRight className="mr-1 h-4 w-4" />
                        </motion.div>
                        <span className={`font-bold ${expandedColumns.includes(column.key.toString()) ? '' : 'truncate w-8'}`}>
                            {expandedColumns.includes(column.key.toString()) ? column.header : column.header.substring(0, 2)}
                        </span>
                        <span className="absolute left-0 -bottom-1 w-full h-0.5 bg-current transform scale-x-0 group-hover:scale-x-100 transition-transform"></span>
                    </button>
                ) : (
                    <>
                        <button
                            onClick={() => handleSort(column.key.toString())}
                            className="flex items-center focus:outline-none group relative"
                        >
                            {column.header}
                            {sortColumn === column.key && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    {sortDirection === 'asc' ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />}
                                </motion.div>
                            )}
                            <span className="absolute left-0 -bottom-1 w-full h-0.5 bg-current transform scale-x-0 group-hover:scale-x-100 transition-transform"></span>
                        </button>
                        {renderFilter(column)}
                    </>
                )}
            </motion.div>
        )

        if (column.resizable) {
            return (
                <Resizable
                    defaultWidth={columnWidths[column.key.toString()] || 200}
                    onResize={(width) => handleColumnResize(column.key.toString(), width)}
                >
                    {content}
                </Resizable>
            )
        }

        return content
    }

    const renderFilter = (column: TableColumn<T>) => {
        switch (column.key) {
            case 'status':
                return (
                    <StatusDropdown
                        status={filters.status || ''}
                        onChange={(value) => onFilterChange('status', value)}
                    />
                )
            case 'priority':
                return (
                    <PriorityDropdown
                        priority={filters.priority || ''}
                        onChange={(value) => onFilterChange('priority', value)}
                    />
                )
            default:
                return null
        }
    }

    return (
        <thead className={`${headerBackgroundColor} ${stickyHeader ? 'sticky top-0 z-10' : ''}`}>
        <tr>
            {columns.map((column) => (
                <th
                    key={column.id || column.key.toString()}
                    className={`px-4 py-2 ${column.width || ''} ${column.hidden && !expandedColumns.includes(column.key.toString()) ? 'w-12' : ''} ${headerTextColor}`}
                    style={{width: columnWidths[column.key.toString()]}}
                >
                    {renderHeaderCell(column)}
                </th>
            ))}
            <th className={`px-4 py-2 w-12 ${headerTextColor}`}>
                <motion.button
                    onClick={toggleAllColumns}
                    className="flex items-center focus:outline-none group relative"
                    title={expandedColumns.length === columns.filter(col => col.hidden).length ? "Collapse All" : "Expand All"}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                >
                    <ChevronLeft className="h-4 w-4"/>
                </motion.button>
            </th>
        </tr>
        </thead>
    )
}


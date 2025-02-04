// components/ui/Table/Table.tsx
"use client"

import React, { useState, useMemo, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { TableHeader } from './TableHeader'
import { TableBody } from './TableBody'
import { useTableSort } from './hooks/useTableSort'
import { useColumnExpansion } from './hooks/useColumnExpansion'
import { useColumnResize } from './hooks/useColumnResize'
import { TableColumn } from './types'

interface TableProps<T> {
    data: T[]
    columns: TableColumn<T>[]
    onRowClick?: (item: T) => void
    backgroundColor?: string
    textColor?: string
    borderColor?: string
    headerBackgroundColor?: string
    headerTextColor?: string
    hoverBackgroundColor?: string
    hoverTextColor?: string
    stickyHeader?: boolean
}

export function Table<T>({
                             data,
                             columns,
                             onRowClick,
                             backgroundColor = 'white',
                             textColor = 'gray-900',
                             borderColor = 'gray-200',
                             headerBackgroundColor = 'gray-100',
                             headerTextColor = 'gray-700',
                             hoverBackgroundColor = 'gray-50',
                             hoverTextColor = 'gray-900',
                             stickyHeader = false,
                         }: TableProps<T>) {
    const tableRef = useRef<HTMLDivElement>(null)
    const [isOneColumn, setIsOneColumn] = useState(false)
    const [filters, setFilters] = useState<{[key: string]: any}>({})

    const { sortedData, sortColumn, sortDirection, handleSort } = useTableSort(data)
    const { expandedColumns, toggleColumnExpansion, toggleAllColumns } = useColumnExpansion(columns)
    const { columnWidths, handleColumnResize } = useColumnResize()

    const filteredData = useMemo(() => {
        return sortedData.filter(item =>
            Object.entries(filters).every(([key, value]) =>
                value === undefined || (item as any)[key] === value
            )
        )
    }, [sortedData, filters])

    const handleFilterChange = (key: string, value: any) => {
        setFilters(prev => ({...prev, [key]: value}))
    }

    useEffect(() => {
        setIsOneColumn(columns.filter(col => !col.hidden).length === 1)
    }, [columns, expandedColumns])

    const convertColor = (color: string, prefix: string) => `${prefix}-${color}`

    return (
        <motion.div
            ref={tableRef}
            className={`overflow-auto ${convertColor(backgroundColor, 'bg')} min-w-full h-full`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <table className={`min-w-full ${convertColor(textColor, 'text')}`}>
                <TableHeader
                    columns={columns}
                    sortColumn={sortColumn}
                    sortDirection={sortDirection}
                    expandedColumns={expandedColumns}
                    columnWidths={columnWidths}
                    handleSort={handleSort}
                    toggleColumnExpansion={toggleColumnExpansion}
                    toggleAllColumns={toggleAllColumns}
                    handleColumnResize={handleColumnResize}
                    headerBackgroundColor={convertColor(headerBackgroundColor, 'bg')}
                    headerTextColor={convertColor(headerTextColor, 'text')}
                    stickyHeader={stickyHeader}
                    filters={filters}
                    onFilterChange={handleFilterChange}
                />
                <TableBody
                    data={filteredData}
                    columns={columns}
                    expandedColumns={expandedColumns}
                    columnWidths={columnWidths}
                    onRowClick={onRowClick}
                    borderColor={convertColor(borderColor, 'border')}
                    hoverBackgroundColor={convertColor(hoverBackgroundColor, 'hover:bg')}
                    hoverTextColor={convertColor(hoverTextColor, 'hover:text')}
                    backgroundColor={convertColor(backgroundColor, 'bg')}
                    textColor={convertColor(textColor, 'text')}
                />
            </table>
        </motion.div>
    )
}


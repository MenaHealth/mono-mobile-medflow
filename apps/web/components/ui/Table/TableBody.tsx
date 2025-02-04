import React from 'react'
import { motion } from 'framer-motion'
import { TableRow } from './TableRow'
import { TableColumn } from './types'

interface TableBodyProps<T> {
    data: T[]
    columns: TableColumn<T>[]
    expandedColumns: string[]
    columnWidths: { [key: string]: number }
    onRowClick?: (item: T) => void
    borderColor: string
    hoverBackgroundColor: string
    hoverTextColor: string
    backgroundColor: string
    textColor: string
}

export function TableBody<T>({
                                 data,
                                 columns,
                                 expandedColumns,
                                 columnWidths,
                                 onRowClick,
                                 borderColor,
                                 hoverBackgroundColor,
                                 hoverTextColor,
                                 backgroundColor,
                                 textColor,
                             }: TableBodyProps<T>) {
    return (
        <motion.tbody>
            {data.length > 0 ? (
                data.map((item, index) => (
                    <TableRow<T>
                        key={index}
                        item={item}
                        columns={columns}
                        expandedColumns={expandedColumns}
                        columnWidths={columnWidths}
                        onRowClick={onRowClick}
                        borderColor={borderColor}
                        hoverBackgroundColor={hoverBackgroundColor}
                        hoverTextColor={hoverTextColor}
                        backgroundColor={backgroundColor}
                        textColor={textColor}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                    />
                ))
            ) : (
                <motion.tr
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <td colSpan={columns.length} className={`text-center py-4 ${textColor}`}>
                        No data available.
                    </td>
                </motion.tr>
            )}
        </motion.tbody>
    )
}

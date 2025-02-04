import React from 'react'
import { TableColumn } from './types'

interface TableCellProps<T> {
    item: T
    column: TableColumn<T>
    expandedColumns: string[]
    columnWidths: { [key: string]: number }
    textColor: string
}

export function TableCell<T>({
                                 item,
                                 column,
                                 expandedColumns,
                                 columnWidths,
                                 textColor,
                             }: TableCellProps<T>) {
    const getCellValue = (item: T, column: TableColumn<T>): React.ReactNode => {
        let value;
        if (column.render) {
            value = column.render(
                column.nestedKey ? getNestedValue(item, column.nestedKey) : item[column.key as keyof T],
                item
            );
        } else if (column.nestedKey) {
            value = getNestedValue(item, column.nestedKey);
        } else {
            value = item[column.key as keyof T];
        }

        if (Array.isArray(value)) {
            return (
                <div className="space-y-2">
                    {value.map((item, index) => (
                        <React.Fragment key={index}>
                            {index > 0 && <hr className="border-t-2 border-orange-500" />}
                            <div>{item}</div>
                        </React.Fragment>
                    ))}
                </div>
            );
        }

        return value as React.ReactNode;
    };

    return (
        <td
            className={`px-4 py-2 ${column.width || ''} ${column.hidden && !expandedColumns.includes(column.key.toString()) ? 'hidden' : ''} ${textColor}`}
            style={{width: columnWidths[column.key.toString()]}}
        >
            {getCellValue(item, column)}
        </td>
    );
}

function getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((value, key) => (value && typeof value === 'object' ? value[key] : undefined), obj);
}


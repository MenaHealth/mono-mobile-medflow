export interface TableColumn<T> {
    key: keyof T | string
    id?: string
    header: string
    render?: (value: any, item: T) => React.ReactNode
    hidden?: boolean
    nestedKey?: string
    width?: string
    resizable?: boolean
    filter?: boolean
}


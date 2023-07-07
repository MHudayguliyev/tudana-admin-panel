export type GetOrderProps = {
    page: number
    limit: number
    startDate: string
    endDate: string
    warehouseGuids: Array<string>
    userGuids: Array<string>
    statusGuids: Array<string>
    clientGuids: Array<string>
    calculateValue: string
    calculateMin: string
    calculateMax: string
    search: string,
    mfd: string
}

export interface ConfirmOrder {
    ord_code: string
    ord_date: string
    ord_delivery_date: string
    ord_total_amount: number
    ord_desc: string
    ord_total: number
    ord_client_guid: string
    ord_warhouse_guid: string
    ord_status_guid: string
    orders_line: {
        row_id: number
        amount: number
        price_total: number
        discount_percent: number
        price_nettotal: number
        ord_line_desc: string | any
        price_value: number
        price_type_guid: string
        discount_amount: number
    }[],
}

export interface ConfirmEditedOrder extends ConfirmOrder {
    ord_guid: string
}

export type EditClient = {
    cl_code: string,
    cl_guid: string,
    cl_name: string,
    cl_full_name: string,
    cl_address: string,
    cl_telephone: string | number,
    cl_add_address?: string,
    cl_add_telephone?: string | number
}
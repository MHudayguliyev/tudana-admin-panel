export type Orders = {
    ord_guid: string
    ord_code: string
    ord_date: string
    ord_create_date: string
    ord_total_amount: string
    ord_total: string
    ord_nettotal: string
    ord_desc: string
    ord_delivery_date: string
    client_name: string
    client_guid: string
    client_code: string
    contact_telephone: string
    contact_address: string
    status_name: string
    ord_status_guid: string
    user_guid: string
    user_name: string
    warehouse_name: string
    isselected: boolean,
    edit_order_allowed: boolean,
    status_code: string
}

export type OrdersList = {
    totalRowCount: number,
    ordersCount: number
    ordersTotalAmount: number
    ordersTotalNettotal: number
    orders: Orders[]
}

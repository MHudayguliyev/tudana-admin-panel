import MaterialList from "./MaterialList"

type OrderData = {
    ord_guid: string
    ord_code: string
    ord_create_date: string
    ord_date: string
    ord_delivery_date: string
    ord_total_amount: string
    ord_total: string
    ord_nettotal: string
    ord_desc: string
    warehouse_guid: string
    client_guid: string
    ord_user_guid: string
    ord_status_guid: string
    order_products: MaterialList[]
    warehouse_name: string
    client_name: string
    status_name: string
}

export default OrderData;
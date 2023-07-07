type ClientsForClientsPage = {
    client_guid: string
    client_name: string
    client_full_name: string
    client_code: string
    client_address: string
    client_telephone: string
    client_balans: number
    addition_addresses?: string
    addition_telephones?: string
    crt_upd_date?: Date | string | any
}

export default ClientsForClientsPage;

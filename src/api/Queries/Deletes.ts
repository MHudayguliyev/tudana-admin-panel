import {Delete} from '@api/service/api_helper'

export const DeleteProduct = async (id: string) => {
    return Delete(`/admin/remove-product/${id}`)
} 
export const DeleteRecept = async (id: string) => {
    return Delete(`/admin/remove-recept/${id}`)
}
export const DeletePartner = async (id: string) => {
    return Delete(`/admin/remove-partner/${id}`)
}
export const DeleteWhouse = async (id: string) => {
    return Delete(`/admin/remove-whouse/${id}`)
}
import { post, put } from "../service/api_helper";

export const createProduct = async (data: any, formData: any, config: any) => {
  return post(`/admin/create-product?unit_guid=${data.unit_guid}&product_code=${data.code}&product_desc=${data.description}`, formData, config)
}

export const createPartner = async (data: any, formData: any, config: any) => {
  return post(`/admin/create-partner?partner=${data.partner}`, formData, config)
}

export const createRecept = async (data: any, formData: any, config: any) => {
  return post(`/admin/create-recept?recepts=${JSON.stringify(data.recepts)}&prepare=${JSON.stringify(data.prepare)}`, formData, config)
}

export const createWhouse = async (data: any, formData: any, config: any) => {
  return post(`/admin/create-whouse?whouse=${data.whouse}`, formData, config)
}

export const updateStatistics = async (data: any) => {
  return put(`/admin/change-statistics`, data)
}

export const updateAboutus = async (data: any) => {
  return put(`/admin/change-aboutus`, data)
}

export const updateServices = async(data: any) => {
  return put(`/admin/change-services`, data)
}


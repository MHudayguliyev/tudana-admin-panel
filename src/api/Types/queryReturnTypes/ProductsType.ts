export type BouquetType = {
    product_code: string | number,
    product_desc: string, 
    unit_name: string, 
    image_name: string,
    image_guid: string
}

export type ReceptType = {
    recept_guid: string, 
    recept_name: string, 
    preparation: string,
    image_name: string,
    image_guid: string
}
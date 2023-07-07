export const SET_PRODUCT_TYPE = 'SET_PRODUCT_TYPE'

export const setProductType = (type: string) =>  ({
    type: SET_PRODUCT_TYPE,
    payload: type
})
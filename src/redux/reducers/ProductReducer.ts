import { AnyAction } from "redux";
import { SET_PRODUCT_TYPE } from "../actions/ProductAction";

const initialState = {
    productType: 'bouquets'
}

const ProductReducer = (state = initialState, action: AnyAction) => {
    switch(action.type){
        case SET_PRODUCT_TYPE: 
            return {
                ...state, 
                productType: action.payload
            }
        default:
            return state
    }
}

export default  ProductReducer
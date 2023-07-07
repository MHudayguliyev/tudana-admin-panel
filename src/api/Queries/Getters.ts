import { get } from "@app/api/service/api_helper";
import { WareHouseList } from "../Types/queryReturnTypes";
import { BouquetType, ReceptType } from "../Types/queryReturnTypes/ProductsType";
import { UnitsType } from "../Types/queryReturnTypes/UnitsType";
import { StatisticsType } from "../Types/queryReturnTypes/StatisticsType";
import { PartnerType } from "../Types/queryReturnTypes/Partner";


export const getStatistics = (): Promise<StatisticsType> => {
    return get<StatisticsType>('/main/get-statistics')
}

export const getRecepts = (): Promise<ReceptType[]> => {
    return get<ReceptType[]>('/main/get-recepts')
}

export const getProducts = (): Promise<BouquetType[]> => {
    return get<BouquetType[]>('/admin/get-products')
}

export const getUnits = (): Promise<UnitsType[]> => {
    return get<UnitsType[]>('/admin/get-units')
}
export const getPartners = (): Promise<PartnerType[]> => {
    return get<PartnerType[]>('/main/get-partners')
}
export const getWhouses = (): Promise<WareHouseList[]> => {
    return get<WareHouseList[]>(`/main/get-wh-data`)
}
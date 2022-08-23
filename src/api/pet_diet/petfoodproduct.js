import { get, } from '../api'
import { petfoodBaseUrl } from '../../config/config'
const baseURL = `${petfoodBaseUrl}/petdiet/`
export const getPetFoodProduct = (params) => {
    return get(`${baseURL}foodproduct/getProductByUPC`, params)
}

/**
 * @dec 这是对
 */
import { get, postJson } from '../api'
import { melladeskBaseUrl } from '../../config/config'
const baseURL = melladeskBaseUrl
export const getPetFoodProduct = (params) => {
    return postJson(`${baseURL}/VetSpire/selectLocationsByOrganization`, params)
}



import axios from "axios"
import Cookies from 'js-cookie'

export const BASE_URL = 'https://geru-rest-api.herokuapp.com'

export function request(headerOptions) {
    let token = Cookies.get('token')
    let referral = Cookies.get('referral')

    let query = {
        // timeout: TIMEOUT,
        baseURL: BASE_URL + '/'
    }

    if (headerOptions) {
        Object.assign(query, {
            headers: {
                ...headerOptions
            }
        })
    }

    if (token) {
        Object.assign(query, {
            headers: {
                Authorization: 'bearer ' + token
            },
        })
    }

    if (referral) {
        if (query.headers) {
            query.headers['referral'] = referral
        } else {
            Object.assign(query, {
                headers: {
                    referral,
                }
            })
        }
    }

    return axios.create(query)
}
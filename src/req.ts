import Taro from '@tarojs/taro';
const BASE_URL = 'http://localhost:3000';

const request = async (url: string, method?: keyof Taro.request.Method, data?: any) => {
    try {
        const response = await Taro.request({
            url: BASE_URL + url,
            method,
            data
        });

        return response
    } catch (error) {
        console.error('Request failed:', error);
        throw error;
    }
};

export const get = (url: string) => request(url, 'GET');
export const post = (url: string, data?: any) => request(url, 'POST', data);
export const put = (url: string, data?: any) => request(url, 'PUT', data);
export const del = (url: string) => request(url, 'DELETE');
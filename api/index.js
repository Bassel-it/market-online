import axios from 'axios'

export const BASE_URL = 'http://basselit2-001-site1.itempurl.com/';
// http://basselit2-001-site1.itempurl.com/
// http://localhost:5079/

export const ENDPOINTS = {
    user: 'Member',
    product:'Product',
    category : 'Category'
    // getAnswers : 'question/getanswers'
}

export const createAPIEndpoint = endpoint => {

    let url = BASE_URL + 'api/' + endpoint + '/';
    return {
        fetch: () => axios.get(url),
        fetchById: id => axios.get(url + id),
        post: newRecord => axios.post(url, newRecord),
        patch: newRecord => axios.patch(url, newRecord),
        put: (id, updatedRecord) => axios.put(url + id, updatedRecord),
        delete: id => axios.delete(url + id),
        deleteByContent :(content)=> axios.patch(url,content)
    }
}
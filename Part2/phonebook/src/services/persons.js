import axios from "axios";

const baseURL = 'http://localhost:3001/persons'

const getAll = () => {
    return axios
        .get(baseURL)
        .then(response => response.data)
}

const create = newObj => {
    return axios
        .post(baseURL, newObj)
        .then(response => response.data)
}

const delObj = objId => {
    return axios
        .delete(`${baseURL}/${objId}`)
}

const update = (newObj, objId) => {
    return axios
        .put(`${baseURL}/${objId}`, newObj)
        .then(response => response.data)
}

export default {
    getAll,
    create,
    delObj,
    update
}
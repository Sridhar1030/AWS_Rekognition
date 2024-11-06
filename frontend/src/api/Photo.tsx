import axios from 'axios';

const url = 'http://localhost:3000/';
export const uploadPhoto = (FormData: FormData) => {
    return axios.post(url, FormData, {
        headers: {
        'Content-Type': 'multipart/form-data',
        },
    });
    }


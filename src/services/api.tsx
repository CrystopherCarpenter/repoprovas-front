import axios from 'axios';
//import dotenv from 'dotenv';
//dotenv.config();

const BASE_URL = 'http://localhost:5000'; //process.env.REACT_APP_API_BASE_URL;

function createConfig(token: string) {
    return {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
}

async function createUser(user: any) {
    await axios.post(`${BASE_URL}/signup`, user);
}

async function login(data: any) {
    const token = await axios.post(`${BASE_URL}/`, data);
    return token;
}

async function logout(token: any) {
    const config = createConfig(token);

    const promise = await axios.delete(`${BASE_URL}/logout`, config);
    return promise;
}

async function authToken(token: any) {
    const config = createConfig(token);

    const promise = await axios.get(`${BASE_URL}/auth-token`, config);
    return promise;
}

async function getData(token: any) {
    const config = createConfig(token);

    const promise = await axios.get(`${BASE_URL}/repository-data`, config);
    return promise;
}

const api = {
    createUser,
    login,
    logout,
    authToken,
    getData,
};

export default api;

import axios from "axios";

const BACKEND_ENDPOINT = 'http://localhost:3000/'

export const login = async (id: string, password: string) => {
    try{
        const response = await axios.post(`${BACKEND_ENDPOINT}api/auth/login`, 
            {
                id: id,
                password: password
            }
        )
        
        return response.data;
    } catch(error) {
        console.error(error);
        throw error;
    }
}

export const register = async (id: string, password: string) => {
    try{
        const response = await axios.post(`${BACKEND_ENDPOINT}api/auth/register`, 
            {
                id: id,
                password: password
            }
        )
        console.log(response.data);
        return response.data;
    } catch(error) {
        console.error(error);
        throw error;
    }
}

export const logout = async () => {
    try{
        // const response = await axios.post(`${BACKEND_ENDPOINT}api/auth/logout`, 
        //     {
        //         id: localStorage.getItem('userId')
        //     }
        // )
        // console.log(response.data);
        localStorage.removeItem('userId');
        // return response.data;
    } catch(error) {
        console.error(error);
        throw error;
    }
}
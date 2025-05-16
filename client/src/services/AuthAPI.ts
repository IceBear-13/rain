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
        console.log(response.data);
        return response.data;
    } catch(error) {
        console.error(error);
        throw error;
    }
}
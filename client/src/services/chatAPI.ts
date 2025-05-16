import axios from "axios";

const BACKEND_ENDPOINT = 'http://localhost:3000/'

export const loadChat = async (rain_id: string) => {
    try {
        const response = await axios.get(`${BACKEND_ENDPOINT}api/chat`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        }
        );
    } catch (error) {
        console.error(error);
        throw error;
    }
}


import axios from 'axios';

const BASE_URL = 'https://localhost:3000/api';

export const getProjects = async (userId: string) => {
    try {
        const response = await axios.get(`${BASE_URL}/projects`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// export const createProject = async (userId, userData) => {
//     try {
//         const response = await axios.put(`${BASE_URL}/users/${userId}`, userData);
//         return response.data;
//     } catch (error) {
//         throw error;
//     }
// };

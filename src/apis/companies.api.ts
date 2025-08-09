import { urls } from "./urls"
import { generateClient } from "./client"

const token = localStorage.getItem("authToken");

export const fetchCompanies = async () => {
    const client= generateClient();
    const response= await client.get(urls.companies.list, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    return response.data;
}
import { urls } from "./urls"
import { generateClient } from "./client"

const token= localStorage.getItem("authToken");

export const exportCompanies= async () =>{
    const client= generateClient();
    const response= await client.get(urls.companies.export, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    return response.data;
}
export const exportCompaniesById= async (id: number) =>{
    const client= generateClient();
    const response= await client.get(urls.companies.byIdExport(id), {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    return response.data;
}
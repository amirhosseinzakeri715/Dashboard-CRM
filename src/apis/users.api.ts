import { urls } from "./urls"
import { generateClient } from "./client"

const token= localStorage.getItem('authToken');

export const fetchUsersList= async () =>{
    const client= generateClient();
    const response= await client.get(urls.users.list, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    return response.data;
}
export const fetchUserById= async (id: number) =>{
    const client= generateClient();
    const response= await client.get(urls.users.byId(id), {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    return response.data;
}
export const refreshToken= async (body: string) =>{
    const client= generateClient();
    const response= await client.post(urls.auth.refresh, {
        refresh: body
    })
    return response.data;
}
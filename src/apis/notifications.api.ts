import { urls } from "./urls"
import { generateClient } from "./client"

const token = localStorage.getItem("authToken");

export const fetchNotifications= async () =>{
    const client= generateClient();
    const response= await client.get(urls.notifications.list, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    return response.data;
}
export const countUnSeenNotifications= async () =>{
    const client= generateClient();
    const response= await client.post(urls.notifications.unread, {}, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    return response.data;
}
import axios from "axios"

export const generateClient= () =>{
  return axios.create({ baseURL: "http://77.91.77.4:6969" })
}
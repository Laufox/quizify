import axios from "axios"

axios.defaults.baseURL = import.meta.env.VITE_ADMIN_API_URL

const adminDeleteUser = async (uid: string) => {

    return await axios.get(`/removeUser?uid=${uid}`)

}

export {
    adminDeleteUser
}
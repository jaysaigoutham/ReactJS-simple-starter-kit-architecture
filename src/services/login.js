import axios from "axios";
const baseuRL = '/api/login'

const login = async credentials => {
    const response = await axios.post(baseuRL, credentials)
    return response.data

}

export default {login}
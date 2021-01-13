import axios from "axios";

const instance = axios.create({
    baseURL : "http://localhost:5001/amz-challenge-5f737/us-central1/api" //clound function url
});

export default instance;
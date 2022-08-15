import HttpClient from "data/http-client/http-client";

const axiosConfig = {
	baseURL: import.meta.env.VITE_API_BASE_URL,
};

console.log({ axiosConfig });

const api = new HttpClient(axiosConfig);

export default api;

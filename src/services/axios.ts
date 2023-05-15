import axios from "axios";

// TODO: have these defaults set by the implementation of IAuth, i.e. FitbitAuth

axios.defaults.baseURL = "https://api.fitbit.com/";
// axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

export default axios;

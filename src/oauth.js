import axios from "axios";
import {fetchToken} from "./common/tools";

let authHeader = 'Bearer ' + fetchToken();

export const ins = () => {
    return axios.create({
        baseURL: 'http://server.com/',
        timeout: 10000,
        headers: {
            'Authorization': authHeader,
            'Accept': 'application/json'
        },
    });
}

export const getEmail = params => {
    return ins().get('api/getEmail', params).then(res => res.data)
}

export const getOauthClients = params => {
    return ins().get('oauth/clients', params).then(res => {
        console.log(res)
        return res.data
    })
}



/*
*
* function (params){
*   ins.get('a',params).then(function(res){
*       return res.data
*   })
* }
*
* */
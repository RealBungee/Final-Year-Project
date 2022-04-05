import { Spot } from '@binance/connector';

async function getAccountInformation(apiKey, apiSecret){
    const client = new Spot(apiKey, apiSecret);
    let res = ''
    client.account().then( response => res = response.data);
    return res;
}

export default {
    getAccountInformation
}
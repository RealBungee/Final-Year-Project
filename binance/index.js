import { Spot } from '@binance/connector';

async function getAccountInformation(apiKey, apiSecret, interaction){
    const client = new Spot(apiKey, apiSecret);
    client.account()
        .then( response => {
            interaction.reply('Succefully connected to binance!');
            return response.data
        })
        .catch(err => {
            console.log(err.response.headers);
            console.log(err.response.status);
            console.log(err.response.data);
            interaction.reply(`Error establishing connection: ${err.response.data.msg}`);
        })
}

export default {
    getAccountInformation
}
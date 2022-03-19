import { deregisterUser } from '../app.js'

async function followAccount(message){
    console.log("Follow Account Command");
}

function deregister(message){
    console.log("Deregistering user");
    deregisterUser(message.author);
}

async function enableTrading(message){
    console.log("Allowing trading for user");
}

export default{
    followAccount,
    deregister,
    enableTrading
}
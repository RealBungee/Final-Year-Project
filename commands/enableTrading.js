import database from '../helperFunctions/database.js';
import structures from '../data/structures.js';
import binance from '../binance/index.js';

async function trading(interaction){
    let key = interaction.options.get('key').value;
    let secret = interaction.options.get('secret').value;

    try{
        await binance.getAccountInformation(key, secret, interaction);
    } catch(err){
        interaction.reply(`Error establishing connection: ${err}`);
    }

    // message.channel.awaitMessages({ filter, max: 1, time: 30000, errors: ['time'] })
	// 	.then(collected => {
    //         let iterator = collected.entries();
    //         key = iterator.next().value[1].content;
    //         message.reply('Enter your API Secret.');
    //         message.channel.awaitMessages({ filter, max: 1, time: 30000, errors: ['time'] })
    //         .then(async collected => {
    //             let iterator = collected.entries();
    //             secret = iterator.next().value[1].content;
    //             message.reply(`Your entered API key: ${key}, and your secret: ${secret}`);
                
    //             message.reply(`Successfully established connection to exchange! News Trading is now enabled.`)
    //         })
    //         .catch((err) => {
    //             console.log(err);
    //         })
	// 	})
    //     .catch(() => {
    //         console.log(`User interaction finished`);
    //     });
}

export {
    trading
}

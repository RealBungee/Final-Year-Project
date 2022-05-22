import commands from '../commands/index.js';
import structures from '../data/structures.js';

async function slashCommandListener(client){
    client.on('interactionCreate', async i => {
        if(!i.isCommand()) return;
        if(!structures.discordUsers.includes(i.user)) return;

        if(i.commandName === 'echo'){
            let input = i.options.get('input');
            await i.reply(`${input.value}`);
        }
        
        commands[i.commandName](i);
    });
}

export {
    slashCommandListener
}
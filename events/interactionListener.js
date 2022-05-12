
async function slashCommandListener(client){
    client.on('interactionCreate', async i => {
        if(!i.isCommand()) return;

        if(i.commandName === 'echo'){
            console.log(i.c)
            let input = i.options.get('input');
            await i.reply(`content: ${input.value}`);
        }
    });
}

export {
    slashCommandListener
}
function messageListener(client){
    client.on('messageCreate', message => {
        // let content = message.content;
        // let author = message.author;

        // if(message.channel.type == 'DM'){
        //     if(structures.discordUsers.includes(author)){
        //         if(author.id == '274614462147985408'){
        //             if(content === 'addTwitter'){
        //                 privateCommands.addTwitterAccount(message);
        //             }
        //         }
        //         if(content === 'help'){
        //             author.send({ embeds: [helpEmbed]});
        //         }
        //         else if(commands.includes(content)){
        //             privateCommands[content](message);
        //         }
        //     }
        // }
    });
}

export {
    messageListener
}
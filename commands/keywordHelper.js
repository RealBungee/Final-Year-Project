//helper function for followAccount and addKeywords functions
async function awaitKeywords(message, filter, account, keywords){
    message.channel.awaitMessages({ filter, max: 1, time: 30000, errors: ['time'] })
        .then(async collected => {
            const keyword = collected.entries().next().value[1].content.toLowerCase();
            
            if(keyword == 'stop' && keywords.length > 0){
                const user = structures.registeredUsers.find(u => u.id == message.author.id);
                user.followedAccounts.set(account, keywords);
                database.updateFollowedAccount(user);
                message.reply('Interaction stopped.');
                return;
            }

            if(keywords.includes(keyword)) {
                message.reply(`The entered keyword has already been added. Type another or type stop.`);
            } else{
                keywords.push(keyword);
                message.reply(`Saving keyword "${keyword}". Type another keyword or type stop to stop interaction.`);
            }
            awaitKeywords(message, filter, account, keywords);
        })
        .catch((err) => { console.log(err)});
}

export {
    awaitKeywords
}
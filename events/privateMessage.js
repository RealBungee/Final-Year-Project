function privateMessageResponse(client, triggerText, replyText){
    
    client.on('messageCreate', message => {
        if(message.channel.type == 'DM' && message.content.toLowerCase() === triggerText.toLowerCase()){
            message.author.send(replyText);
        }
    });
}

export {
    privateMessageResponse
}
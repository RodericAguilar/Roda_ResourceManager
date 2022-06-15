const { Webhook } = require('discord-webhook-node');
// Thanks to guillermo rp!
exports("sendData", (url, webhookurl) => {
    const hook = new Webhook(webhookurl);
 
    hook.sendFile(url);   
});
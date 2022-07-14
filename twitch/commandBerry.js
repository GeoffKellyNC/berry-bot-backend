require('dotenv').config()
const { RefreshingAuthProvider } = require('@twurple/auth')
const { promises: fs } = require('fs')
const { ChatClient } = require('@twurple/chat');


const path = require('path')
const axios = require('axios')

const botConfigEP = process.env.BOT_CONFIG_BOT_ENDPOINT 



async function getTarget () {
    const res = await axios.get(botConfigEP)
    const target = res.data[0].target
    return target
}

const getBotConfig = async () => {
    const configLocation = path.join(__dirname, 'bot-config.json')
    const configData = JSON.parse(await fs.readFile(configLocation, 'utf-8'))
    return configData
}

const connect = async () => {
    const TARGET = await getTarget()
    const configData = await getBotConfig()
    const clientId = configData.clientId
    const clientSecret = configData.clientSecret
    const tokenLocation = path.join(__dirname, 'bot-config.json')
    const tokenData = JSON.parse(await fs.readFile(tokenLocation, 'utf-8'))
    const authProvider = new RefreshingAuthProvider(
        {
            clientId,
            clientSecret,
            onRefresh: async newTokenData => await fs.writeFile(tokenLocation, JSON.stringify({...tokenData, ...newTokenData, target: TARGET}, null, 4, 'UTF-8'))
        },
        tokenData
    );


    const chatClient = new ChatClient({
        authProvider,
        channels: [TARGET]
    })
    await chatClient.connect()

    return chatClient
}


async function chatBerry(message){
    const chatClient = await connect()
    const target = await getTarget()

    await chatClient.say(target, message)
    await chatClient.quit()

}


module.exports = { chatBerry }
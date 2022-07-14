require('dotenv').config()
const { RefreshingAuthProvider } = require('@twurple/auth')
const { promises: fs } = require('fs')
const { ChatClient } = require('@twurple/chat');


const path = require('path')
const axios = require('axios')

const botConfigEP = process.env.BOT_CONFIG_BOT_ENDPOINT



const getTarget = async () => {
    const res = await axios.get(botConfigEP)
    const target = res.data[0].target
    return target
}

const getBotConfig = async () => {
    const getRes = await axios.get(botConfigEP)
    const configData = getRes.data[0]
    return configData
}


const connect = async () => {
    const TARGET = await getTarget()
    const configData = await getBotConfig()
    const clientId = configData.clientId
    const clientSecret = configData.clientSecret
    const authProvider = new RefreshingAuthProvider(
        {
            clientId,
            clientSecret,
            onRefresh: async newTokenData => await refreshConfig(newTokenData)
        },
        configData
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
require('dotenv').config()
const { RefreshingAuthProvider } = require('@twurple/auth')
const { ChatClient } = require('@twurple/chat');

const path = require('path')
const axios = require('axios')

const pointEndpoint = process.env.USER_POINTS_ENDPOINT
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

const refreshConfig = async (data) => {
    const getRes = await axios.get(botConfigEP)
    const oldData = getRes.data[0]
    const newData = {...oldData, ...data }
    const postRes = await axios.patch(`${botConfigEP}/1`, newData)
}

const getPoints = async (user) => {
    try{
        const res = await axios.get(pointEndpoint)
        const pointsData = res.data
        const userObj = await pointsData.find(account => account.user === user)
        const userPoints = userObj.points
        return userPoints
    }catch(err){
        console.log('Error Getting Points berry.js: ', err)
    }
}

async function berry() {
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
    const date = new Date()
     console.log(`Berry PUB Dev connected to ${TARGET} at ${date.toLocaleString()}`)
    
    chatClient.onMessage( async(channel, user, message) => {

        console.log(`
        USER 🧍: ${user}  ➡ 
        MESSAGE 💬: ${message} ➡ 
        CHANNEL 📺:  ${channel} ➡ 
        📆 ${date}`)

        switch (message) {
            case '!ping':
                chatClient.say(channel, 'Pong!')
                break;
            case '!points':
                const userPoints = await getPoints(user)
                chatClient.say(channel,`${user} you have ${userPoints} points.`)
                break;
            default:
                break;
        }
    })
}

module.exports = { berry }
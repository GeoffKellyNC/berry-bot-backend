require('dotenv').config()
const { RefreshingAuthProvider } = require('@twurple/auth')
const { promises: fs } = require('fs')
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
    const configLocation = path.join(__dirname, 'bot-config.json')
    const configData = JSON.parse(await fs.readFile(configLocation, 'utf-8'))
    return configData
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
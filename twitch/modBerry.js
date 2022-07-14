require('dotenv').config()

const axios = require('axios')
const { ChatClient } = require('@twurple/chat');
const { RefreshingAuthProvider } = require('@twurple/auth')
const { promises: fs } = require('fs')
const path = require('path')
const { whiteList}  = require('../data/moderation/whitelist')


// --- End Points ---//
const pointEndpoint = process.env.USER_POINTS_ENDPOINT
const modEp = process.env.BOT_CONFIG_MOD_ENDPOINT
const botConfigEP = process.env.BOT_CONFIG_BOT_ENDPOINT 


const getConfigData = async (type) => {
    switch(type){
        case 'getwords':
            console.log('Getting Banned Words')
            const res = await axios.get(modEp)
            const bannedWords = res.data[0].bannedWords
            return bannedWords
        default:
            console.log('There was an error in getConfigData $modBerry.js')
    }
}

const getTarget = async () => {
    console.log('Getting Target....')
    const res = await axios.get(botConfigEP)
    const target = res.data[0].target
    return target
}

const getBotConfig = async () => {
    const configLocation = path.join(__dirname, 'bot-config.json')
    const configData = JSON.parse(await fs.readFile(configLocation,
        'utf-8'))
    return configData
}

const getPointsData = async () => {
    try{
        const response = await axios.get(pointEndpoint)
        const data = response.data
        return data
        
    }catch(err){
        console.log('Get Points Data Func: ', err)
    }

}

const setUserPoints = async (user, points) => {
    try {
        const newUser = { user, points }
        const response = await axios.post(pointEndpoint, newUser)
        return response.status

    }catch(err){
        console.log('Set User Points Func Error: ', err)
    }
}

const patchPoints = async (id, obj,user) => {
    try{
        const response = axios.patch(`${pointEndpoint}/${id}`, obj)
        return response

    }catch(err){
        console.log('Patch Points Error: ', err)
    }
}

const checkUser = async (user, pointsData) => {
    let found;
    for (let i = 0; i < pointsData.length; i++){
        if (pointsData[i].user === user){
            found = true
        }else{
             found =  false
        }
    }
    return found
}

const handlePunishment = async(user, points, chatClient, channel) => {
    if (points <= 3) return
    if (points >= 5 ){
        chatClient.say(channel, `${user} has been timed out for getting to many points!`)
        await chatClient.timeout(channel, user, 30, 'Berry Bot Point Timeout > 5')
        console.log(`${user} has been timed out for 30 seconds.`)
    }
}

const processMessage = async (user, message, chatClient, channel, bannedWords) => {


    console.log(`
    USER 🧍: ${user}  ➡ 
    MESSAGE 💬: ${message} ➡`)

    try{
        if(bannedWords.includes(message) && !whiteList.includes(user)){
            let pointsData = await getPointsData()
            let userExists = await checkUser(user, pointsData)
            console.log(userExists)

            chatClient.say(channel, `@${user} please do not used banned language!`)

            if(!userExists){
                setUserPoints(user, 1)
                console.log(`${user} was not found.. User set!`) //? Console.log 
            }
            if(userExists){
                const userObj = pointsData.find(account => account.user === user)
                let points = userObj.points
                const updatedObj = {...userObj, points: points += 1}
                const userId = userObj.id
                const newPoints = updatedObj.points;
                await patchPoints(userId,updatedObj,user)
                await handlePunishment(user, newPoints, chatClient,channel)
            }
        }
    }catch(err){
        console.log('Moderation Error: ', err)
    }
}

async function modBerry (){
    console.log('Mod Bot Running....')
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

    const bannedWords = await getConfigData('getwords')

    await chatClient.connect()
    console.log('Berry Mod Connected to Twitch Chat')


    chatClient.onMessage( async(channel, user, message, self) => {
       await processMessage(user, message, chatClient, channel, bannedWords)
    })
}

module.exports = { modBerry }





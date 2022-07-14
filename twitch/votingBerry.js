require('dotenv').config()

const { RefreshingAuthProvider } = require('@twurple/auth')
const { promises: fs } = require('fs')
const { ChatClient } = require('@twurple/chat');
const path = require('path')


const getTarget = async () => {
    const targetLocation = path.join(__dirname, 'bot-config.json')
    const targetData = JSON.parse(await fs.readFile(targetLocation, 'utf-8'))
    const target = targetData.target
    return target
}

const getBotConfig = async () => {
    const configLocation = path.join(__dirname, 'bot-config.json')
    const configData = JSON.parse(await fs.readFile(configLocation, 'utf-8'))
    return configData
}

const getAverage = (arr) => {
    return arr.reduce((a,b) => parseInt(a) + parseInt(b), 0) / arr.length
}

const endProcess = async (chatClient, date) => {
    await chatClient.quit()
    console.log(`Voting Disconnected at ${date}`)
}


async function votingBerry() {
    console.log('Running Voting Berry....')
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
    console.log(`Voting was started at ${date}...`)

    await chatClient.onRegister(() => {
        chatClient.say(TARGET, 'Voting has Started!')
        chatClient.say(TARGET, 'Type 1 - 10 in the chat to vote on the current song!')
    })

    let uniqueValues = ['420']
    let votes = [];
    let voted = [];


    chatClient.onMessage( async (channel, user, message, self) => {
        const host = channel.substring(1)
        const authUsers = [host, 'rhyezbot', 'xberrybot', 'rhyeznc']

        if ((message >= 1 && message <= 10) || uniqueValues.includes(message)){
            if(!voted.includes(user)){
                if(message === '420'){
                    chatClient.say(channel, `Ayeeeee @${user} You already know what time it is!!! Take a dab `)
                }else{
                    votes.push(message)
                    voted.push(user)
                    chatClient.say(TARGET, `${user} has voted ${message}!`)
                    console.log(`${user} voted!`)
                }
            }else{
                chatClient.say(TARGET, `@${user}, you have already voted!`)
            }
        }

        if(message === '!endvote'){
            if(authUsers.includes(user)){
                const average = getAverage(votes)
                chatClient.say(channel, ` Voting Ended! Banger Score:  ${average.toFixed(2)}`)
                voted = []
                votes = []
                setTimeout(() => {
                    endProcess(chatClient, date)
                }
                , 2000)
            }else{
                chatClient.say(channel, `@${user} you are not authorized to end the vote`)
            }
        }

    })
}

module.exports = { votingBerry }




let input = document.querySelector('#input-chat')
let upperChat = document.querySelector('.upper-chat')
let modelInput = document.querySelector('#model')
let tempInput = document.querySelector('#temp')
let threadsInput = document.querySelector('#threads')
let n_predictInput = document.querySelector('#n_predict')
let pcModel = document.querySelector('#pc-model')
let threadsCores = document.querySelector('#threads-cores')
let memory = document.querySelector('#memory')
let cpuPercentage = document.querySelector('#cpu-percentage')
let ramPercentage = document.querySelector('#ram-percentage')

const ALPACA_URL = "http://localhost:3000"
let computerStats = {}

const write = async (event) => {
    if(event.key === 'Enter'){
        event.preventDefault()
        createChatbox(input.value, false)
        console.log({ prompt: input.value })
        callAlpaca(getConfig())
        input.value = ''
    }
}

//Dalai library does this weird thing of splitting the word by . (Since I can only run Alpaca I left it as placeholder)
const getConfig = () => {
    return {
        model: `alpaca.${modelInput.value}`,
        prompt: input.value,
        temp: tempInput.value,
        n_predict: n_predictInput.value,
        threads: threadsInput.value
    }
}

const callAlpaca = async (config) => {
    console.log(config)
    const response = await fetch(`${ALPACA_URL}/alpaca`,{
        method: "POST",
        body: JSON.stringify(config),
        headers: {
          "Content-Type": "application/json"
        }
    })
    const { alpaca } = await response.json()
    createChatbox(alpaca)
}

const createChatbox = (msg, isAlpaca = true) => {
    //div creation
    let div = document.createElement("div")
    upperChat.append(div)
    div.classList.add("chat-box")

    if(isAlpaca) div.style.backgroundColor = "#444654"

    let p = document.createElement('p')
    p.textContent = msg
    div.append(p)
}

const getStats = async () => {
    try {
        const stats = await fetch(`${ALPACA_URL}/api/stats`)
        const ram = await stats.json()
        computerStats = {...ram}
        console.table(computerStats)
        refreshStats(computerStats)    
    } catch (error) {
        console.error(error)
    }
}

const refreshStats = (computerStats) => {
    pcModel.textContent = `${computerStats.cpuModel}`
    threadsCores.textContent = `${computerStats.cpuThreads}T / ${computerStats.cpuCores}C`
    memory.textContent = `${computerStats.usedMemory} / ${Math.round(computerStats.totalMemory)}GB`
    cpuPercentage.textContent = `${computerStats.cpuUsage}%`
    ramPercentage.textContent = `${computerStats.memoryUsage}%`
}

input.addEventListener('keypress', write)

getStats()

setInterval(async () => {
    getStats(computerStats)
}, 3000);


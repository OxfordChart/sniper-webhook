const express = require('express')
const fetch = require('node-fetch')
const app = express()
app.use(express.json())
app.use(express.text())

const BOT_TOKEN     = process.env.BOT_TOKEN
const CHAT_ID_BASE  = process.env.CHAT_ID_BASE
const CHAT_ID_VIP   = process.env.CHAT_ID_VIP

function extractText(body) {
    if (typeof body === 'string') {
        try {
            const parsed = JSON.parse(body)
            return parsed.text || body
        } catch {
            return body
        }
    }
    if (typeof body === 'object' && body.text) {
        try {
            const parsed = JSON.parse(body.text)
            return parsed.text || body.text
        } catch {
            return body.text
        }
    }
    return JSON.stringify(body)
}

async function sendToTelegram(chatId, text) {
    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, text: text })
    })
}

app.post('/webhook', async (req, res) => {
    try {
        const msg = extractText(req.body)

        // Il VIP riceve sempre tutto
        await sendToTelegram(CHAT_ID_VIP, msg)

        // Il canale base riceve solo i segnali su XAUUSD
        if (msg.includes('XAUUSD')) {
            await sendToTelegram(CHAT_ID_BASE, msg)
        }

        res.sendStatus(200)
    } catch (err) {
        console.error(err)
        res.sendStatus(500)
    }
})

app.get('/', (req, res) => res.send('SNIPER Webhook attivo ✅'))

app.listen(process.env.PORT || 3000, () => console.log('Server avviato'))

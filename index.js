const express = require('express')
const fetch = require('node-fetch')
const app = express()
app.use(express.json())
app.use(express.text())

const BOT_TOKEN = process.env.BOT_TOKEN
const CHAT_ID   = process.env.CHAT_ID

function extractText(body) {
    // Se è stringa, prova a fare il parse JSON
    if (typeof body === 'string') {
        try {
            const parsed = JSON.parse(body)
            return parsed.text || body
        } catch {
            return body
        }
    }
    // Se è oggetto con campo text, prendi solo text
    if (typeof body === 'object' && body.text) {
        // il campo text potrebbe essere ancora un JSON stringa
        try {
            const parsed = JSON.parse(body.text)
            return parsed.text || body.text
        } catch {
            return body.text
        }
    }
    return JSON.stringify(body)
}

app.post('/webhook', async (req, res) => {
    try {
        const msg = extractText(req.body)
        await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chat_id: CHAT_ID, text: msg })
        })
        res.sendStatus(200)
    } catch (err) {
        console.error(err)
        res.sendStatus(500)
    }
})

app.get('/', (req, res) => res.send('SNIPER Webhook attivo ✅'))

app.listen(process.env.PORT || 3000, () => console.log('Server avviato'))

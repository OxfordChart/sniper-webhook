const express = require('express')
const fetch = require('node-fetch')
const app = express()
app.use(express.json())

const BOT_TOKEN = process.env.BOT_TOKEN
const CHAT_ID   = process.env.CHAT_ID

app.post('/webhook', async (req, res) => {
    try {
        const msg = req.body.text || JSON.stringify(req.body)
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

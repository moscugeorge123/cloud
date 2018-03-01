const express = require('express')
const app = express()
const env = require('dotenv').config()
const request = require('request')
const cors = require('cors')
const fs = require('fs')

let date = new Date()
date = date.getDate() + '-' + (date.getMonth() + 1) + '-' + date.getFullYear();

app.use(cors());

app.get('/weather', (req, res) => {
    request.get(process.env.weather + '&q=' + req.query.city, (err, resp, body) => {
        if (err) res.send(JSON.stringify(err));
        body = JSON.parse(body)

        if (!body.main) {
            res.status(404)
            res.send({ message: 'Unable to find city weather' })
            fs.appendFileSync(
                './logs/' + date + '.log',
                '[/weather] [ERROR]: ' + req.connection.remoteAddress + ' asked for \'' + req.query.city + "\'\n")
            return
        }

        fs.appendFileSync(
            './logs/' + date + '.log',
            '[/weather]: ' + req.connection.remoteAddress + ' asked for \'' + req.query.city + "'\n"
        )

        res.send({
            temp: body.main.temp,
            description: body.weather[0].description.charAt(0).toUpperCase() + body.weather[0].description.slice(1),
            humidity: body.main.humidity,
            wind_speed: body.wind.speed,
            coord: body.coord
        })

    })
})

app.get('/place', (req, res) => {
    request.get(process.env.google + '&input=' + req.query.place, (err, resp, body) => {

        body = body
            .replace(/ă/g, "a")
            .replace(/î/g, "i")
            .replace(/â/g, "a")
            .replace(/ș/g, "s")
            .replace(/ț/g, "t")
            .replace(/Ă/g, "A")
            .replace(/Î/g, "I")
            .replace(/Â/g, "A")
            .replace(/Ș/g, "S")
            .replace(/Ț/g, "T")

        const response = []

        for (prediction of JSON.parse(body).predictions) {
            response.push({
                description: prediction.description,
                value: prediction.terms[0].value
            })
        }

        res.send(response)

        fs.appendFileSync(
            './logs/' + date + '.log',
            '[/place]: ' + req.connection.remoteAddress + ' asked for \'' + req.query.place + "'\n"
        )
    })
})

app.get('/pictures', (req, res) => {
    request.get(process.env.pixabay + '&q=' + req.query.place, (err, resp, body) => {
        body = JSON.parse(body)

        const response = []

        for (hit of body.hits) {
            response.push(hit.webformatURL)
        }

        res.send(response)

        fs.appendFileSync(
            './logs/' + date + '.log',
            '[/pictures]: ' + req.connection.remoteAddress + ' asked for \'' + req.query.place + "'\n"
        )
    })
})

app.listen(3000)

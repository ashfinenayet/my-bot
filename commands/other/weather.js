const fetch = require("node-fetch");
const { Command } = require('discord.js-commando');
const path = require('path');
const { weatherAPI } = require('../../config.json');
module.exports = class WeatherCommand extends Command {
    constructor(client) {
      super(client, {
        name: 'weather',
        aliases: ['weather'],
        memberName: 'weather',
        group: 'other',
        description: 'shows the weather in your area',
        guildOnly: true
      });
    }
    run(message) {
        let zipCode = message.content.split(" ")[1];
        if (
            zipCode === undefined ||
            zipCode.length != 5 ||
            parseInt(zipCode) === NaN
        ) {
            return message.channel
                .send("The zipcode is incorrect. Try again with !weather (zipcode)")
                .catch(console.error);
        }
        let url =
            "http://api.openweathermap.org/data/2.5/weather?zip=" +
            zipCode +
            weatherAPI;

        fetch(url, { method: "get" })
            .then((response) => {
                let parsedWeather = response
                    .json()
                    .then((x) => {
                        return message.channel.send(`
            🎯The current weather
              🏡 Location: ${x.name}, ${x.sys.country}
              🌁 Forecast: ${x.weather[0].main}
               🌡️ Current Temperature: ${Math.round(
                            ((x.main.temp - 273.15) * 9) / 5 + 32
                        )} °F
               ⬆️  High Temperature: ${Math.round(
                            ((x.main.temp_max - 273.15) * 9) / 5 + 32
                        )} °F
               ⬇️  Low Temperature: ${Math.round(
                            ((x.main.temp_min - 273.15) * 9) / 5 + 32
                        )} °F
                `);
                    })
                    .catch((e) => {
                        console.log("Error parsing JSON: " + e);
                    });
            })
            .catch((e) => {
                message.channel.send("There was an error retrieving weather data: " + e);
            });
    }
}
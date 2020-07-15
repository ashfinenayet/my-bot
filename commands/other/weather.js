const fetch = require("node-fetch");
const { Command } = require('discord.js-commando');
const path = require('path');
const { MessageEmbed } = require('discord.js');
const weatherAPI = process.env.weatherAPI;
module.exports = class WeatherCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'weather',
            aliases: ['weather'],
            memberName: 'weather',
            group: 'other',
            description: 'shows the weather in your area. must provide a valid zipcode',
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
                        const weatherEmbed = new MessageEmbed()

                            .setTitle('🎯The current weather')
                            .addField('🏡 Location:', `${x.name}, ${x.sys.country}`)
                            .addField('🌁 Forecast:', `${x.weather[0].main}`)
                            .addField('🌡️ Current Temperature:', `${Math.round(
                                ((x.main.temp - 273.15) * 9) / 5 + 32
                            )} °F`
                            )
                            .addField('⬆️  High Temperature:', ` ${Math.round(
                                ((x.main.temp_max - 273.15) * 9) / 5 + 32
                            )} °F
                            `)
                            .addField('⬇️  Low Temperature:', `${Math.round(
                                ((x.main.temp_min - 273.15) * 9) / 5 + 32
                            )} °F`)
                            .setColor('#420626');
                        return message.channel.send(
                            weatherEmbed);
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

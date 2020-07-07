const fetch = require("node-fetch");
module.exports = {
    name: 'weather',
    description: "tells you the weather",
    execute(message){
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
            ",us&APPID=89788f412abb005a35dd260f88e56efd";

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
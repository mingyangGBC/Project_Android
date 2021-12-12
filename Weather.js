import React, { Component, useState } from 'react'
import { StyleSheet, Text, Image, View } from 'react-native'

export default class Weather extends Component {
    constructor(weeklyWeatherData) {
        super()
        var today = new Date(),
        date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
        this.state = {
            data: weeklyWeatherData,
            city: weeklyWeatherData.weeklyWeather.city.name,
            country: weeklyWeatherData.weeklyWeather.city.country,
            currentDate: date,
            currentDay: today.getDay(),
            forecast_temp: [],
            forecast_main: [],
            forecast_icon: [],
            lon: weeklyWeatherData.weeklyWeather.city.coord.lon,
            lat: weeklyWeatherData.weeklyWeather.city.coord.lat,
        }
        this.getWeather();
    }
    
    getWeather = async() => {
        for (let i = 0; i < 7; i++) {
            this.state.forecast_icon.push(this.state.data.weeklyWeather.list[i].weather[0].icon)
            this.state.forecast_main.push(this.state.data.weeklyWeather.list[i].weather[0].main)
            this.state.forecast_temp.push(this.calculateCel(this.state.data.weeklyWeather.list[i].temp.eve))
        }
    }

    getDay(day) {
        let day1 = ''
        switch ( true ) {
            case day === 0:
                day1 = 'Sunday'
                break
            case day === 1:
                day1 = 'Monday'
                break
            case day === 2:
                day1 = 'Tuesday'
                break
            case day === 3:
                day1 = 'Wednesday'
                break
            case day === 4:
                day1 = 'Thursday'
                break
            case day === 5:
                day1 = 'Friday'
                break
            case day === 6:
                day1 = 'Saturday'
                break
        }
        return day1
    }

    calculateCel(temp) {
        let cel = Math.floor(temp-273.15)
        return cel
    }

    getIcon(icon) {
        let url = `https://openweathermap.org/img/wn/${icon}@2x.png`
        return url
    }

    getDayArray() { 
        let day = []
        let start = this.state.currentDay
        for(let i = 0; i < 7; i++){
            if(start > 6){
                day[i] = start - 7
                start = start + 1
            }
            else{
                day[i] = start
                start = start + 1
            }
        }
        return day
    }

    forecast() {
        let forecast = []
        let day = this.getDayArray()
        for(let i = 0; i < 7; i++){
            // console.log(this.state.forecast_icon[i])
            forecast.push(
                <View key={i} style={styles.layout}>
                    <Text>{this.getDay(day[i])}</Text>
                    <Image style={styles.image} source={{uri: `${this.getIcon(this.state.forecast_icon[i])}`,}}/>
                    <Text style={styles.forecast}>{this.state.forecast_main[i]}</Text>
                    <Text style={styles.deg}>{this.state.forecast_temp[i]}&deg;C</Text>
                </View>
            )
        }

        return forecast
    }
    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.city}>{this.state.city}, {this.state.country}</Text>
                {/* <Text style={styles.date}>{this.state.lat}  {this.state.lon}</Text> */}
                <Text style={styles.date}>{this.state.currentDate}</Text>
                {this.forecast()}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    city: {
        textAlign: "center",
        fontSize: 28,
        color: "black",
        marginTop:50,
    },
    date: {
        textAlign: "center",
        fontSize: 16,
        color: "black",
    },
    layout: {
        padding: 10,
        marginVertical: 8,
        marginHorizontal: 16,
        borderBottomWidth: 3,
        backgroundColor: "#f0a905",
        alignItems: "center",
        justifyContent:"space-between",
        flexDirection: "row",
      },
    image: {
        width: 100,
        height: 100,
        alignSelf: "flex-start",
        paddingRight: 20
    },
    deg: {
        fontSize: 24,
        fontWeight: "bold",
        paddingRight: 20
    },
    forecast: {
        alignSelf: "center",
        fontSize: 18,
        fontWeight: "bold",
        paddingRight: 20
    }
  });



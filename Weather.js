import React, { Component, useState } from 'react'
import { SafeAreaView, Text, Image, View } from 'react-native'
import * as Location from 'expo-location';

export default class Weather extends Component {

    constructor() {
        super()
        this.state={
            city:undefined,
            country: undefined,
            // 7 days of the temperature
            forecast_temp:[],
            // icon id for seven days
            forecast_icon:[],
            // weather for seven days
            forecast_main:[],
            lon:0,
            lat:0,
        }
        this.getWeather()
    }

    
    getWeather = async() =>{

        
        //https://pro.openweathermap.org/data/2.5/forecast/climate?lat=${location.coords.latitude}&lon=${location.coords.longitude}&appid=${API_KEY} (for lat, lon )
        //https://pro.openweathermap.org/data/2.5/forecast/climate?q=Toronto&appid=${API_KEY} (for specific city test)
        const location = await Location.getCurrentPositionAsync()
        const API_KEY = '5a9f3d77f65a849f70e24fd83bd9d3b0'
        const api = await fetch(`https://pro.openweathermap.org/data/2.5/forecast/climate?lat=${location.coords.latitude}&lon=${location.coords.longitude}&appid=${API_KEY}`)
        const response = await api.json()
        console.log(response)

        var today = new Date(),
        date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();

        this.setState({
            city: response.city.name,
            country: response.city.country,
            currentDate: date,
            currentDay: this.getDay(today.getDay()),
            lon: location.coords.longitude,
            lat: location.coords.latitude
        })
        for(let i = 0; i < 7; i++){
            const tempory_temp = [this.calculateCel(response.list[i].temp.eve)]
            const tempory_main = [response.list[i].weather[0].main]
            const tempory_icon = [response.list[i].weather[0].icon]
            this.setState({
                forecast_temp:[...this.state.forecast_temp, tempory_temp],
                forecast_main:[...this.state.forecast_main, tempory_main],
                forecast_icon:[...this.state.forecast_icon, tempory_icon],
            })
        }
      }

    getDay(day){
        let day1 = ''
        switch(true){
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

    calculateCel(temp){
        let cel = Math.floor(temp-273.15)
        return cel
    }

    getIcon(icon){
        let url = `http://openweathermap.org/img/wn/${icon}@2x.png`
        return url
    }

    forecast(){
        let forecast = []
        
        for(let i = 0; i < 7; i++){
            forecast.push(
                <View key={i}>
                    <Text>{this.state.forecast_temp[i]} Degree</Text>
                    <Text>Weather: {this.state.forecast_main[i]}</Text>
                </View>
            )
        }

        return forecast
    }

    //`${this.getIcon(this.state.forecast_icon[0])}`}
    //<Image source={{uri: `https://via.placeholder.com/150`}}/>
    render() {
        return (
            <SafeAreaView>
                <Text>Weather APP</Text>
                <Text>{this.state.city}, {this.state.country}</Text>
                <Text>{this.state.lat}{this.state.lon}</Text>
                <Text>{this.state.currentDate}</Text>
                <Text>{this.state.currentDay}</Text>
                
                <Image source={{uri: `${this.getIcon(this.state.forecast_icon[0])}`}}/>
                {this.forecast()}
                
            </SafeAreaView>

            
        )
    }
}


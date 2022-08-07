class TempManager {

    constructor() {
        this.cityData = []
    }
    async getDataFromDB() {
        const cities = await $.get(`cities/`)
        this.cityData = cities
    }
    async getCityData(cityName) {
        cityName = cityName.charAt(0).toUpperCase() + cityName.slice(1);
        const response = await $.get(`/city/${cityName}`)
        if (Number(response.status) !== 404 &&
            !this.cityData.find(o => o.name == cityName)) {
            const city = response.data
            this.cityData.unshift({
                _id: city._id,
                name: city.name,
                temperature: Math.round(city.temperature),
                condition: city.condition,
                conditionPic: city.conditionPic,
                isInDatabase: city.isInDatabase,
                date: city.date

            })
        }
    }
    saveCity(cityName) {
        cityName = cityName.charAt(0).toUpperCase() + cityName.slice(1);
        let data = {}
        for (const city of this.cityData) {
            if (city.name === cityName) {
                data = city
            }
        }
        if (!data.isInDatabase) {
            data.isInDatabase = true
            $.post('/city', data, function (response) {
                console.log(response)
            })
        }
    }
    async removeCity(cityName) {
        await axios.delete(`/city/${cityName}`)
    }
    async updateCity(cityName) {
        await axios.put(`/city/${cityName}`)
    }

}
const tempManager = new TempManager()
const render = new Renderer()


const loadPage = async function () {
    await tempManager.getDataFromDB()
    await render.renderData(tempManager.cityData)
}
const handleSearch = async function () {
    const cityName = $("#city-input").val()
    $("#city-input").val("")
    await tempManager.getCityData(cityName)
    await render.renderData(tempManager.cityData)
}
loadPage()
$('.cities').on('click', ".remove-city", async function () {
    const cityName = $(this).closest(".city").find("h5").text()
    await tempManager.removeCity(cityName)
    loadPage()
})
$('.cities').on('click', ".add-city", async function () {
    const cityName = $(this).closest(".city").find("h5").text()
    tempManager.saveCity(cityName)
    render.renderData(tempManager.cityData)
})
loadPage()

$('.cities').on('click', ".refresh-city", async function () {
    const cityName = $(this).closest(".city").find("h5").text()
    tempManager.updateCity(cityName)
    loadPage()
    render.renderData(tempManager.cityData)
})
loadPage()
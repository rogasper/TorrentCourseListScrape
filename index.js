const request = require('request-promise')
    // const fs = require('fs')
const cheerio = require('cheerio')
const ObjectsToCsv = require('objects-to-csv')

// const scrapeSample = {
//     title: "Deep Learning Prerequisites: The Numpy Stack in Python (V2+)",
//     url: "magnet:?xt=urn:btih:A3C1BC603EA23395D4A2C73E6F5E531D99DCA02F&dn=Deep+Learning+Prerequisites%3A+The+Numpy+Stack+in+Python+%28V2%2B%29&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969%2Fannounce&tr=udp%3A%2F%2F9.rarbg.to%3A2920%2Fannounce&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337&tr=udp%3A%2F%2Ftracker.internetwarriors.net%3A1337%2Fannounce&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969%2Fannounce&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969%2Fannounce&tr=udp%3A%2F%2Ftracker.pirateparty.gr%3A6969%2Fannounce&tr=udp%3A%2F%2Ftracker.cyberia.is%3A6969%2Fannounce"
// }

const scrapeResults = []

async function createCsvFile(data) {
    let csv = new ObjectsToCsv(data)

    await csv.toDisk("./udemySearchTorrentbyTuts756.csv", { allColumns: true })
}

async function scrape() {
    try {
        for (let i = 0; i <= 35; i++) {
            // Change the URL
            const url = `https://piratebay.party/search/udemy/${i}/3/0`
            const url2 = `https://piratebay.party/user/tuts756/${i}/3`
            const html = await request.get(url2)
            const $ = await cheerio.load(html)
            $('table#searchResult tbody tr td:nth-child(4) a').each((index, element) => {
                const title = $(element).parent().parent().parent().children('td:nth-child(2)').text().replace(/(\r\n|\n|\r)/gm, "")
                const uploaded = $(element).parent().parent().parent().children('td:nth-child(3)').text().replace(/(\r\n|\n|\r)/gm, "")
                const size = $(element).parent().parent().parent().children('td:nth-child(5)').text().replace(/(\r\n|\n|\r)/gm, "")
                const seeder = $(element).parent().parent().parent().children('td:nth-child(6)').text().replace(/(\r\n|\n|\r)/gm, "")
                const leecher = $(element).parent().parent().parent().children('td:nth-child(7)').text().replace(/(\r\n|\n|\r)/gm, "")
                const url = $(element).prop('href')
                const scrapeResult = { title, url, uploaded, size, seeder, leecher }
                    // console.log(scrapeResult)
                scrapeResults.push(scrapeResult)
            })
        }
        return scrapeResults
    } catch (error) {
        console.error(error)
    }

}

// scrape()

async function udemyTorrentScrape() {
    const listLink = await scrape()
    console.log(listLink)
    await createCsvFile(listLink)
}

udemyTorrentScrape().then(result => console.log("Scraping Success"))
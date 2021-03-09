import { text } from '@cbcruk/dom'
import _ from 'lodash'

function getCurrent(document: Document) {
  try {
    const weatherArea = document.querySelector('.today_weather .weather_area')
    const current = weatherArea.querySelector('.current').childNodes
    const icon = document.querySelector<HTMLElement>('.today_weather .ico')
    const summary = weatherArea.querySelector('.summary')
    const main = summary.removeChild(_.last(summary.children))
    const summaryList = Array.from(
      weatherArea.querySelector('.summary_list').children
    ).map((element) => text(element))
    const todayTemp = Array.from(
      document.querySelectorAll<HTMLElement>('#weekly .item .data')
    ).map((node) => text(node.childNodes[1]))

    return {
      isNight: icon.classList.contains('night'),
      weather: {
        main: text(main),
        description: text(summary),
        icon: icon.dataset.ico,
      },
      main: {
        temp: text(current[1]),
        feelsLike: summaryList[5],
        tempMin: todayTemp[0],
        tempMax: todayTemp[1],
        humidity: summaryList[1],
      },
      wind: {
        speed: summaryList[3],
        deg: summaryList[2],
      },
    }
  } catch (error) {
    console.log(error)
  }
}

export default getCurrent

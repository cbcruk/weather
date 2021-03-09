import { text } from '@cbcruk/dom'
import _ from 'lodash'

function getHourly(document: Document) {
  const climateRainPop = Array.from(
    document.querySelectorAll('.climate_rain .row_icon .value')
  ).map((element) => text(element))
  const climateRainPrecipitation = Array.from(
    document.querySelectorAll('.climate_rain .row_graph .data')
  )
    .map((element) => {
      const colSpan = _.toNumber(element.getAttribute('colspan'))
      const value = text(element)

      if (colSpan) {
        return _.times(colSpan, () => value)
      }

      return value
    })
    .flatMap((value) => value)
  const climateHumidity = Array.from(
    document.querySelectorAll('.climate_humidity .num')
  ).map((element) => text(element))
  const climateWindSpeed = Array.from(
    document.querySelectorAll('.climate_wind .row_graph .num')
  ).map((element) => text(element))
  const climateWindDeg = Array.from(
    document.querySelectorAll('.climate_wind .row_icon .value')
  ).map((element) => text(element))

  const timeList = Array.from(
    document.querySelectorAll<HTMLElement>('.time_list .item_time')
  ).map((node, index) => {
    const { tmpr, wetrTxt, ymdt, isDaytime } = node.dataset
    const icon = node.querySelector<HTMLElement>('.ico').dataset.ico

    return {
      main: {
        temp: tmpr,
        main: wetrTxt,
        time: ymdt,
        icon,
        isDaytime: isDaytime === 'true',
      },
      rain: {
        pop: climateRainPop[index],
        precipitation: climateRainPrecipitation[index],
      },
      humidity: climateHumidity[index],
      wind: {
        speed: climateWindSpeed[index],
        deg: climateWindDeg[index],
      },
    }
  })

  return timeList
}

export default getHourly

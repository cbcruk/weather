import { text } from '@cbcruk/dom'

function getCity(document: Document) {
  const locationName = document.querySelector<HTMLElement>('.location_name')
  const sunRiseSet = Array.from(
    document.querySelectorAll<HTMLElement>(
      '#sunRiseSet .sun_tr:nth-child(1) .sun_time'
    )
  ).map((node) => text(node))

  return {
    name: text(locationName),
    sunrise: sunRiseSet[0],
    sunset: sunRiseSet[1],
  }
}

export default getCity

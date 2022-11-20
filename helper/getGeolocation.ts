function getGeolocation(): Promise<Partial<GeolocationCoordinates>> {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        })
      })
    } else {
      reject('위치정보 사용 불가능')
    }
  })
}

export default getGeolocation

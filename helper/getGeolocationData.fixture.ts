export const GEOCODE = {
  status: { code: 0, name: 'ok', message: 'done' },
  results: [
    {
      name: 'legalcode',
      code: { id: '4161011400', type: 'L', mappingId: '02610114' },
      region: {
        area0: { name: 'kr', coords: { center: { crs: '', x: 0, y: 0 } } },
        area1: {
          name: '경기도',
          coords: { center: { crs: 'EPSG:4326', x: 127.550802, y: 37.436318 } },
          alias: '경기',
        },
        area2: {
          name: '광주시',
          coords: { center: { crs: 'EPSG:4326', x: 127.255048, y: 37.429431 } },
        },
        area3: {
          name: '고산동',
          coords: { center: { crs: 'EPSG:4326', x: 127.2234, y: 37.3742 } },
        },
        area4: { name: '', coords: { center: { crs: '', x: 0, y: 0 } } },
      },
    },
  ],
}

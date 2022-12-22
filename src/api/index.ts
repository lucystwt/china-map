import request from '~/helpers/request'

export enum AreaCategory {
  Province = 'province',
  City = 'city',
  District = 'district',
}

export type Area = {
  adcode: number
  lng: number
  lat: number
  name: string
  level: AreaCategory
  parent: number
}

export async function getGeoJson(adcode: number | string) {
  return request<unknown, Record<string, any>>(`/json/geo/${adcode}.json`)
}

export async function getAllArea() {
  return request<unknown, Area[]>('/json/all-area.json')
}

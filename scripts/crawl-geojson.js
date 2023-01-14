/**
 * 从阿里云抓取各区域的 geojson
 */
import { readdir, readFile, rm, writeFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
import { dirname, extname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import axios from 'axios'

function getGeoPath() {
  const __filename = fileURLToPath(import.meta.url)
  const __dirname = dirname(__filename)
  const geoPath = resolve(__dirname, '../public/json/geo')
  return geoPath
}

function getHasGeoAreas() {
  const _require = createRequire(import.meta.url)
  const list = _require('../public/json/all-area.json')
  const filteredList = list.filter((item) => item.level !== 'district')
  return filteredList
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function prepareGeoFiles() {
  const existsFiles = []
  try {
    const geoPath = getGeoPath()
    const files = await readdir(geoPath)
    for (let f of files) {
      const filepath = resolve(geoPath, f)
      const file = await readFile(filepath)
      const fileExtname = extname(filepath)
      // 空文件就删除
      if (file.byteLength <= 0 || !fileExtname.includes('json')) {
        await rm(filepath)
      } else {
        existsFiles.push(f)
      }
    }
  } catch (err) {
    console.error(err)
  }
  const hasGeoAreas = await getHasGeoAreas()
  const requestList = hasGeoAreas.filter(
    (item) => !existsFiles.find((f) => f.includes(item.adcode + ''))
  )
  return requestList
}

async function catchGeoJson() {
  try {
    const requestList = await prepareGeoFiles()
    if (!requestList.length) {
      console.log('Not need to catched geojson data.')
      return
    }
    for (const reqItem of requestList) {
      try {
        const res = await axios.get(
          `https://geo.datav.aliyun.com/areas_v3/bound/${reqItem.adcode}_full.json`
        )
        if (res.status === 200) {
          const data = JSON.stringify(res.data)
          const geoPath = resolve(getGeoPath(), reqItem.adcode + '.json')
          await writeFile(geoPath, data)
          console.log(`Success write data to ${geoPath}`)
        }
      } catch (err) {
        console.error(JSON.stringify(err))
      }
      await sleep(1500)
    }
  } catch (err) {
    console.error(JSON.stringify(err))
  }
}

catchGeoJson()

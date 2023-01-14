import { useState } from "react"

import ChartMap from "./components/chart-map"
import Navbar from "./components/navbar"
import useArea from "./hooks/area"

export default function App() {
  const { adCodeToAreaMap } = useArea()
  const [selectedAdcodes, setSelectedAdcodes] = useState<number[]>([100000])
  const currentAdcodes = selectedAdcodes[selectedAdcodes.length - 1]
  const navbarList = selectedAdcodes.map((code) => {
    const area = adCodeToAreaMap.get(code)
    return {
      key: code,
      text: area ? area.name : "未知城市",
    }
  })

  return (
    <div className="w-screen h-screen bg-gray-200 relative">
      <Navbar
        list={navbarList}
        className="absolute top-4 left-4"
        onItemClick={(record, idx) =>
          setSelectedAdcodes((pv) => pv.filter((item, index) => index <= idx))
        }
      />
      <ChartMap
        adcode={currentAdcodes}
        onChange={(adcode) => setSelectedAdcodes((pv) => [...pv, adcode])}
      />
    </div>
  )
}

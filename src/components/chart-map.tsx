import { useEvent } from "ab-hooks"
import * as echarts from "echarts"
import EChartsReact from "echarts-for-react"
import { memo, useMemo, useState } from "react"
import useSWR from "swr"

import { getGeoJson } from "~/api"
import { getChartOption } from "~/helpers/chart"
import useArea from "~/hooks/area"

type Props = {
  adcode: number
  onChange: (adcode: number) => void
}

export default memo(function ChartMap({ adcode, onChange }: Props) {
  const codeStr = adcode + ""
  const { nameToAreaMap } = useArea()
  const [registeredMap, setRegisteredMap] = useState(
    new Map<string, Record<string, any>>()
  )
  const changeEvent = useEvent(onChange)

  const { isLoading } = useSWR(
    registeredMap.has(codeStr) ? null : `/api/geo/${adcode}`,
    () => getGeoJson(adcode),
    {
      onSuccess: (data) => {
        echarts.registerMap(codeStr, data as any)
        setRegisteredMap((pv) => new Map(pv).set(codeStr, data))
      },
      errorRetryCount: 0,
    }
  )

  const chartOption = useMemo(() => {
    let result = {}
    if (registeredMap.has(codeStr)) result = getChartOption(codeStr)
    return result
  }, [codeStr, registeredMap])

  const events = useMemo(
    () => ({
      click: (params: { name: string }) => {
        const area = nameToAreaMap.get(params.name)
        if (!area) {
          console.error("找不到该区域", params.name)
          return
        }
        changeEvent(area.adcode)
      },
    }),
    [changeEvent, nameToAreaMap]
  )

  return (
    <EChartsReact
      className="!w-full !h-full"
      option={chartOption}
      showLoading={isLoading}
      onEvents={events}
      notMerge
    />
  )
})

import { useMemo } from "react"
import useSWR from "swr"

import { Area, getAllArea } from "~/api"

const initialAreas: Area[] = []

export default function useArea() {
  const {
    data = initialAreas,
    error,
    isLoading,
  } = useSWR("/api/all-area", getAllArea)

  const nameToAreaMap = useMemo(
    () => new Map(data.map((item) => [item.name, item])),
    [data]
  )
  const adCodeToAreaMap = useMemo(
    () => new Map(data.map((item) => [item.adcode, item])),
    [data]
  )

  return {
    data,
    error,
    isLoading,
    nameToAreaMap,
    adCodeToAreaMap,
  }
}

'use client'
import { useCallback, useEffect, useState } from 'react'
import { SnapshotInfo } from '@/types'

type LatestSnapshotProps = {
  clusterName: string
  apiUrl: string
  isGlobalSnapshot?: boolean
}

// We should fetch each 5 seconds for new snapshots
const REFRESH_TIME = 5

export function LatestSnapshot({
  clusterName,
  apiUrl,
  isGlobalSnapshot,
}: LatestSnapshotProps) {
  const [seconds, setSeconds] = useState(0)
  const [snapshotInfo, setSnapshotInfo] = useState({
    value: {},
  } as SnapshotInfo)

  const storeSnapshot = (response: SnapshotInfo) => {
    const storedHashes = localStorage.getItem(clusterName)
    if (!storedHashes || Object.keys(JSON.parse(storedHashes)).length === 0) {
      localStorage.setItem(`${clusterName}`, JSON.stringify([response]))
    } else {
      const storedHashesParsed: SnapshotInfo[] = JSON.parse(storedHashes)

      if (storedHashesParsed.length >= 20) {
        storedHashesParsed.shift()
      }

      const ordinalAlreadyFilled = storedHashesParsed.some(
        (storedSnapshot) =>
          storedSnapshot.value.ordinal === response.value.ordinal,
      )
      if (ordinalAlreadyFilled) {
        return
      }

      storedHashesParsed.push(response)
      localStorage.setItem(`${clusterName}`, JSON.stringify(storedHashesParsed))
    }
  }

  const fetchData = useCallback(async () => {
    const url = isGlobalSnapshot
      ? `${apiUrl}/global-snapshots/latest`
      : `${apiUrl}/snapshots/latest`

    const snapshotsResponse = await fetch(url, {
      headers: {
        Accept: 'application/json',
      },
      cache: 'no-store',
      next: {
        revalidate: 5,
      },
    })
    const response: SnapshotInfo = await snapshotsResponse.json()
    setSnapshotInfo(response)
    if (typeof window !== 'undefined') {
      storeSnapshot(response)
    }
    setSeconds(0)
  }, [])

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    setTimeout(() => {
      if (seconds < REFRESH_TIME) {
        setSeconds(seconds + 1)
      } else {
        fetchData()
      }
    }, 1000)
  }, [seconds])

  return (
    <div
      className={`rounded-lg shadow ${
        isGlobalSnapshot
          ? 'bg-[#4D515A] dark:bg-[#40454E] text-white'
          : 'bg-[#B9DD6D] text-black'
      }`}
    >
      <div className="flex flex-col p-6">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden">
              <div className="grid w-full grid-cols-2">
                <div>
                  <h3 className="text-lg font-semibold">{clusterName}</h3>
                </div>
                <div className="text-end flex justify-end">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="mt-[5px]"
                  >
                    <path
                      d="M7 1.3125C5.87512 1.3125 4.7755 1.64607 3.8402 2.27102C2.90489 2.89597 2.17591 3.78423 1.74544 4.82349C1.31496 5.86274 1.20233 7.00631 1.42179 8.10958C1.64124 9.21285 2.18292 10.2263 2.97833 11.0217C3.77374 11.8171 4.78716 12.3588 5.89043 12.5782C6.99369 12.7977 8.13726 12.685 9.17652 12.2546C10.2158 11.8241 11.104 11.0951 11.729 10.1598C12.3539 9.2245 12.6875 8.12488 12.6875 7C12.6859 5.49207 12.0862 4.04636 11.0199 2.98009C9.95365 1.91382 8.50793 1.31409 7 1.3125ZM10.0625 7.4375H7C6.88397 7.4375 6.77269 7.39141 6.69064 7.30936C6.6086 7.22731 6.5625 7.11603 6.5625 7V3.9375C6.5625 3.82147 6.6086 3.71019 6.69064 3.62814C6.77269 3.54609 6.88397 3.5 7 3.5C7.11604 3.5 7.22732 3.54609 7.30936 3.62814C7.39141 3.71019 7.4375 3.82147 7.4375 3.9375V6.5625H10.0625C10.1785 6.5625 10.2898 6.6086 10.3719 6.69064C10.4539 6.77269 10.5 6.88397 10.5 7C10.5 7.11603 10.4539 7.22731 10.3719 7.30936C10.2898 7.39141 10.1785 7.4375 10.0625 7.4375Z"
                      fill="white"
                      className={isGlobalSnapshot ? 'fill-white' : 'fill-black'}
                    />
                  </svg>
                  {seconds}s
                </div>
              </div>
              <div className="grid w-full grid-cols-1 text-center">
                <div className="text-[54px]">{snapshotInfo.value.ordinal}</div>
                <div>Latest Snapshot</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
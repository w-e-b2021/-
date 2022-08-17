import { useEffect, useRef, useState } from 'react'

export default function Index(value) {
  let [data, setData] = useState(value)
  let myref = useRef()
  useEffect(() => {
    myref.current && myref.current()
  }, [data])
  return [
    data,
    function (value, callback) {
      setData(value)
      myref.current = callback
    }
  ]
}

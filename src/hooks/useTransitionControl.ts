import { Dispatch, SetStateAction, useEffect, useState } from 'react'

const useTransitionControl = (
  loading = false,
): [boolean, Dispatch<SetStateAction<boolean>>] => {
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (!loading) {
      setTimeout(() => setShow(true))
    }
  }, [loading])

  return [show, setShow]
}

export default useTransitionControl

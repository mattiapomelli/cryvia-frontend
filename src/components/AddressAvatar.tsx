import { useLayoutEffect, useMemo, useRef } from 'react'
import jazzicon from '@metamask/jazzicon'

interface AddressAvatarProps {
  address: string
  size?: number
}

const AddressAvatar = ({ address, size = 16 }: AddressAvatarProps) => {
  const iconRef = useRef<HTMLSpanElement>(null)
  const icon = useMemo(
    () => (address ? jazzicon(size, parseInt(address.slice(2, 10), 16)) : null),
    [address, size],
  )

  useLayoutEffect(() => {
    const current = iconRef.current
    if (icon) {
      current?.appendChild(icon)
    }

    return () => {
      if (icon) {
        current?.removeChild(icon)
      }
    }
  }, [icon, iconRef])

  return <span ref={iconRef} className="inline-flex" />
}

export default AddressAvatar

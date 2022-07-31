import Image from 'next/image'
import Link from 'next/link'

interface LogoProps {
  href?: string
  className?: string
}

const Logo = ({ href = '/', className }: LogoProps) => {
  return (
    <Link href={href}>
      <a className={className}>
        <Image
          src="/images/logo.png"
          width="132"
          height="35"
          alt="Cryvia"
          priority
        />
      </a>
    </Link>
  )
}

export default Logo

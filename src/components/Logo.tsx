import Link from 'next/link'
import classNames from 'classnames'

interface LogoProps {
  href?: string
  className?: string
  onClick?: () => void
}

const Logo = ({ href = '/', className, onClick }: LogoProps) => {
  return (
    <Link href={href}>
      <a
        role="none"
        onClick={onClick}
        className={classNames('text-2xl font-black', className)}
      >
        <h1>Cryvia</h1>
      </a>
    </Link>
  )
}

export default Logo

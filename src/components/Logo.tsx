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
        className={classNames('text-xl font-bold', className)}
      >
        <h1>Crypto Quizzes</h1>
      </a>
    </Link>
  )
}

export default Logo

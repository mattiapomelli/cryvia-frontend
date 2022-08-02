import { Menu, Transition } from '@headlessui/react'
import {
  AnchorHTMLAttributes,
  ElementType,
  forwardRef,
  Fragment,
  ReactNode,
} from 'react'
import Link from 'next/link'
import classNames from 'classnames'
import { useDisconnect } from 'wagmi'

import { getAddressExplorerLink } from '@/constants/urls'
import useTokenBalance from '@/hooks/useTokenBalance'
import CopyIcon from '@/icons/copy.svg'
import DisconnectIcon from '@/icons/disconnect.svg'
import ExternalLinkIcon from '@/icons/externallink.svg'
import ProfileIcon from '@/icons/profile.svg'
import copyToClipboard from '@/utils/copyToClipboard'
import Address from './Address'
import AddressAvatar from './AddressAvatar'

interface WrappedLinkProps {
  href: string
  children: ReactNode
  className?: string
}

const WrappedLink = forwardRef<HTMLAnchorElement, WrappedLinkProps>(
  (props, ref) => {
    const { href, children, ...rest } = props

    return (
      <Link href={href}>
        <a ref={ref} {...rest}>
          {children}
        </a>
      </Link>
    )
  },
)

WrappedLink.displayName = 'WrappedLink'

interface DropdownItemProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  as?: ElementType
  icon: ReactNode
  text: string
  onClick?: () => void
}

const DropdownItem = ({
  as: Tag = 'button',
  icon,
  text,
  ...rest
}: DropdownItemProps) => {
  return (
    <Menu.Item>
      {({ active }) => (
        <Tag
          className={classNames(
            'flex w-full items-center rounded-default px-2.5 py-2 hover:bg-gray-100 text-sm gap-2',
            { 'bg-gray-100': active },
          )}
          {...rest}
        >
          <span className="text-lg">{icon}</span>
          {text}
        </Tag>
      )}
    </Menu.Item>
  )
}

const WalletDropdown = ({ address }: { address: string }) => {
  const { balance } = useTokenBalance()
  const { disconnect } = useDisconnect()

  return (
    <Menu as="div" className="relative z-20">
      <Menu.Button className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 py-1.5 px-2 rounded-full">
        <span>
          {balance?.formatted} {balance?.symbol}
        </span>
        <span>
          <Address address={address} className="font-bold" />
        </span>
        <AddressAvatar address={address} />
      </Menu.Button>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute p-1 right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-default bg-white shadow-md ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="px-1 py-1 ">
            <DropdownItem
              icon={<ProfileIcon />}
              text="Profile"
              href={`/${address}`}
              as={WrappedLink}
            />
            <DropdownItem
              icon={<CopyIcon />}
              text="Copy address"
              onClick={() => copyToClipboard(address)}
              as="button"
            />
            <DropdownItem
              icon={<ExternalLinkIcon />}
              text="See in explorer"
              href={getAddressExplorerLink(address)}
              target="_blank"
              rel="noopener noreferrer"
              as="a"
            />
          </div>
          <div className="px-1 py-1">
            <DropdownItem
              icon={<DisconnectIcon />}
              text="Disconnect"
              as="button"
              onClick={() => disconnect()}
            />
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  )
}

export default WalletDropdown

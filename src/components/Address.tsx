interface AddressProps {
  address: string
}

const Address = ({ address }: AddressProps) => {
  return (
    <span>
      {address.substring(0, 6)}...{address?.substring(address.length - 4)}
    </span>
  )
}

export default Address

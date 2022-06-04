import { ethers } from 'ethers'

export const formatAmount = (amount: ethers.BigNumberish, decimals = 18) =>
  ethers.utils.formatUnits(amount, decimals)

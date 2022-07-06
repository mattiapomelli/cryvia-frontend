import { ethers } from 'ethers'

export const formatAmount = (amount: ethers.BigNumberish, decimals = 18) =>
  ethers.utils.formatUnits(amount, decimals)

export const parseAmount = (amount: number, decimals = 18) =>
  ethers.utils.parseUnits(amount.toString(), decimals)

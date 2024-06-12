export interface TransferInputDto {
  origin: string
  destination: string
  amount: number
}

interface AccountData {
  id: string
  balance: number
}

export interface TransferOutputDto {
  origin: AccountData
  destination: AccountData
}

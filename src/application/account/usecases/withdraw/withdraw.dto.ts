export interface WithdrawInputDto {
  origin: string
  amount: number
}

export interface WithdrawOutputDto {
  id: string
  balance: number
}

export interface EventInputDto {
  type: string
  data: {
    origin?: string
    destination?: string
    amount: number
  }
}

export interface DepositInputDto {
  destination: string
  amount: number
}

export interface DepositOutputDto {
  destination: {
    id: string
    balance: number
  }
}

export interface WithdrawInputDto {
  origin: string
  amount: number
}

export interface WithdrawOutputDto {
  origin: {
    id: string
    balance: number
  }
}

export interface TransferInputDto {
  origin: string
  destination: string
  amount: number
}

export interface TransferOutputDto {
  origin: {
    id: string
    balance: number
  }
  destination: {
    id: string
    balance: number
  }
}

import { type DepositInputDto, type DepositOutputDto } from './deposit.dto'

export interface DepositUsecaseInterface {
  execute: (input: DepositInputDto) => Promise<DepositOutputDto>
}

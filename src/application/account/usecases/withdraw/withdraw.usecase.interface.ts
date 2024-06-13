import { type WithdrawInputDto, type WithdrawOutputDto } from './withdraw.dto'

export interface WithdrawUsecaseInterface {
  execute: (input: WithdrawInputDto) => Promise<WithdrawOutputDto>
}

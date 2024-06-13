import { type GetBalanceInputDto, type GetBalanceOutputDto } from './get-balance.dto'

export interface GetBalanceUsecaseInterface {
  execute: (input: GetBalanceInputDto) => Promise<GetBalanceOutputDto>
}

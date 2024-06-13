import { type TransferInputDto, type TransferOutputDto } from './transfer.dto'

export interface TransferUsecaseInterface {
  execute: (input: TransferInputDto) => Promise<TransferOutputDto>
}

import Account from '../../../../domain/account/account'
import WithdrawUsecase from './withdraw.usecase'

describe('Withdraw usecase tests', () => {
  const accountRepository = {
    save: jest.fn(),
    get: jest.fn()
  }
  const usecase = new WithdrawUsecase(accountRepository)

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('Should withdraw from existing account', async () => {
    const input = {
      origin: '100',
      amount: 5
    }
    accountRepository.get.mockReturnValueOnce(new Account('100', 20))
    const output = await usecase.execute(input)
    expect(output).toEqual({
      id: '100',
      balance: 15
    })
  })

  it('Should throw an error if account not found', async () => {
    const input = {
      origin: '100',
      amount: 10
    }
    accountRepository.get.mockReturnValueOnce(null)
    await expect(usecase.execute(input)).rejects.toThrow('Account not found')
  })

  it('Should throw an error if amount is greater than balance', async () => {
    const input = {
      origin: '100',
      amount: 30
    }
    accountRepository.get.mockReturnValueOnce(new Account('100', 20))
    await expect(usecase.execute(input)).rejects.toThrow('Insufficient funds')
  })

  it('Should throw an error if amount is zero', async () => {
    const input = {
      origin: '100',
      amount: 0
    }
    accountRepository.get.mockReturnValueOnce(new Account('100', 20))
    await expect(usecase.execute(input)).rejects.toThrow('Amount must be greater than zero')
  })

  it('Should throw an error if amount is less than zero', async () => {
    const input = {
      origin: '100',
      amount: -10
    }
    accountRepository.get.mockReturnValueOnce(new Account('100', 20))
    await expect(usecase.execute(input)).rejects.toThrow('Amount must be greater than zero')
  })
})

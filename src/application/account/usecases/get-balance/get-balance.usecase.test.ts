import Account from '../../../../domain/account/account'
import GetBalanceUsecase from './get-balance.usecase'

describe('Get balance usecase tests', () => {
  const accountRepository = {
    save: jest.fn(),
    get: jest.fn()
  }
  const usecase = new GetBalanceUsecase(accountRepository)

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('Should get balance', async () => {
    const input = {
      accountId: '100'
    }
    accountRepository.get.mockReturnValueOnce(new Account('100', 20))
    const output = await usecase.execute(input)
    expect(output).toEqual({
      balance: 20
    })
  })

  it('Should throw an error if account not found', async () => {
    const input = {
      accountId: '100'
    }
    accountRepository.get.mockReturnValueOnce(null)
    await expect(usecase.execute(input)).rejects.toThrow('Account not found')
  })
})

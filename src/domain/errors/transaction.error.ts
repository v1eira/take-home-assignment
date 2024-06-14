export default class TransactionError extends Error {
  constructor (message: string) {
    super(message)
    this.name = 'TransactionError'
    Object.setPrototypeOf(this, TransactionError.prototype)
  }
}

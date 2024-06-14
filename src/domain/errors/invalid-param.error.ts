export default class InvalidParamError extends Error {
  constructor (message: string) {
    super(message)
    this.name = 'InvalidParamError'
    Object.setPrototypeOf(this, InvalidParamError.prototype)
  }
}

export class NotAllowedError extends Error {
  constructor(details: string = 'No more details') {
    super(`Operation not allowed - ${details}`)
  }
}

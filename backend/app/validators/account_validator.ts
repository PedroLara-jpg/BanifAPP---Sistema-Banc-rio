import vine from '@vinejs/vine'

export const createAccountValidator = vine.compile(
  vine.object({
    usuarioId: vine.number().positive().withoutDecimals(),
    numeroConta: vine.string().trim().minLength(4).maxLength(20),
    numeroAgencia: vine.string().trim().minLength(4).maxLength(10),
    initialBalance: vine.number().min(0).optional(),
  })
)

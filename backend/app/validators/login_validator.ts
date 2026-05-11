import vine from '@vinejs/vine'

export const loginValidator = vine.compile(
  vine.object({
    email: vine.string().email().trim().toLowerCase(),
    senha: vine.string().minLength(6),
  })
)

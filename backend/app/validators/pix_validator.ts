import vine from '@vinejs/vine'

export const pixValidator = vine.compile(
  vine.object({
    numeroConta: vine.string().trim().minLength(4).maxLength(20),
    valor: vine.number().positive().min(0.01),
  })
)

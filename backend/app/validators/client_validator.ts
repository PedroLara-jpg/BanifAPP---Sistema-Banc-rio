import vine from '@vinejs/vine'

export const createClientValidator = vine.compile(
  vine.object({
    nomeCompleto: vine.string().trim().minLength(3).maxLength(255),
    email: vine.string().email().trim().toLowerCase(),
    senha: vine.string().minLength(6).maxLength(100),
    cpf: vine.string().trim().minLength(11).maxLength(14),
    endereco: vine.object({
      cidade: vine.string().trim().minLength(2).maxLength(100),
      estado: vine.string().trim().minLength(2).maxLength(2),
      rua: vine.string().trim().minLength(3).maxLength(255),
      numero: vine.string().trim().minLength(1).maxLength(20),
    }),
  })
)

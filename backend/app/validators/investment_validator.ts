import vine from '@vinejs/vine'

export const createInvestmentValidator = vine.compile(
  vine.object({
    tipoInvestimentoId: vine.number().positive().withoutDecimals(),
    valor: vine.number().positive().min(0.01),
  })
)

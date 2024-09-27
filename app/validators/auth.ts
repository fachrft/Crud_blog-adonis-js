import vine from '@vinejs/vine'


export const registerValidator = vine.compile(
    vine.object({
        username: vine.string(),
        email: vine.string().email().normalizeEmail().unique(async (db, value) => {
            const match = await db.from('users').select('id').where('email', value).first()
            return !match
        }),
        password: vine.string().minLength(8)
    })
)

export const loginValidator = vine.compile(
    vine.object({
        email: vine.string().email().toLowerCase(),
        password: vine.string().minLength(8)
    })
)
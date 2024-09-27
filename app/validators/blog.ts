import vine from '@vinejs/vine'

export const blogValidator = vine.compile(
    vine.object({
        image: vine.file({
            size: '2mb',
            extnames: ['jpg', 'png', 'jpeg'],
        }),
        title: vine.string(),
        desc: vine.string().minLength(10),
    })
)

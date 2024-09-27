import type { HttpContext } from '@adonisjs/core/http'
import Blog from '#models/blog'
import { blogValidator } from '#validators/blog'
import app from '@adonisjs/core/services/app'
import { cuid } from '@adonisjs/core/helpers'

export default class BlogController {
  async getData({ response }: HttpContext) {
    const data = await Blog.all()
    return response.status(200).json({
      data,
    })
  }

  async getDataById({request, response}: HttpContext) {
    const params = request.param('id')
    const blog = await Blog.findByOrFail('id', params)
    return response.status(200).json({
        data : blog
    })
  }

  async postData({ request, response }: HttpContext) {
    const data = await request.validateUsing(blogValidator)
    const image = data.image
    const namaFile = `${cuid()}.${image.extname}`
    await image.move(app.makePath('public/uploads'), {
      name: namaFile,
    })
    const blog = await Blog.create({
      title: data.title,
      desc: data.desc,
      image: `uploads/${namaFile}`,
    })
    return response.status(200).json({
      messages: 'blog post',
      blog,
    })
  }

  async updateData({ request, response }: HttpContext) {
    const params = request.param('id')
    const blog = await Blog.findByOrFail('id', params)
    const { image, title, desc } = await request.validateUsing(blogValidator)

    if (image) {
      const namaFile = `${cuid()}.${image.extname}`
      await image.move(app.makePath('public/uploads'), {
        name: namaFile,
      })
      blog.image = `uploads/${namaFile}`
    } 

    blog.merge({
        title: title || blog.title,
        desc: desc || blog.desc,
    })

    await blog.save()
    return response.status(200).json({
      message: 'updated successfully',
      data: blog,
    })
  }

  async deleteData({request, response}: HttpContext) {
    const params = request.param('id')
    const blog = await Blog.findByOrFail('id', params)
    await blog.delete()
    return response.status(200).json({
        message: 'deleted successfully',
      })
  }
}

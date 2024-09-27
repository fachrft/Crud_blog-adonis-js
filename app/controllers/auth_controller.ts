import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import { registerValidator, loginValidator } from '#validators/auth'

export default class AuthController { 
  async register({request, response}: HttpContext) {
    const data = await request.validateUsing(registerValidator);
    const user = await User.create(data)
    return response.status(201).json({
      messages : 'register successfully',
      data: user,
    })
  }
  
  async login({request}: HttpContext) {
    const {email, password} = await request.validateUsing(loginValidator)
    const user = await User.verifyCredentials(email, password)
    return User.accessTokens.create(user)
  }
  
  async logout({auth, response}: HttpContext) {
    const user = auth.user!
    await User.accessTokens.delete(user, user.currentAccessToken.identifier)
    return response.status(200).json({
      messages: 'logout was successful'
    })
  }
  
  async me({auth, response}: HttpContext) {
    await auth.check()
    return response.status(200).json({
      user: auth.user
    })
  }
  
}
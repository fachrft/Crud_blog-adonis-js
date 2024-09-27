/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'
const AuthController = () => import('#controllers/auth_controller')
const BlogController = () => import('#controllers/blog_controller')

router.get('/', async ({ view }) => {
  return view.render('welcome')
})

router.post('/register', [AuthController, 'register'])
router.post('/login', [AuthController, 'login'])
router
  .group(() => {
    router.delete('/logout', [AuthController, 'logout'])
    router.get('/me', [AuthController, 'me'])
    router.get('/blog', [BlogController, 'getData'])
    router.post('/blog', [BlogController, 'postData'])
    router.get('blog/:id', [BlogController, 'getDataById'])
    router.put('/blog/:id', [BlogController, 'updateData'])
    router.delete('/blog/:id', [BlogController, 'deleteData'])
  })
  .use(middleware.auth())

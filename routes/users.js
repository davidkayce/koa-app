const Router = require('koa-router')
const User = require('../models/user')
const user = new Router() // How to nest routes

user.get('/', async ctx => {
  try {
    const users = await User.find({})
    ctx.body = users
  } catch (e) {
    ctx.status = 500
    ctx.body = 'Internal server error'
  }
})

user.get('/:id', async ctx => {
  const _id = ctx.params.id
  try {
    const user = await User.findById(_id)
    if (!user) {
      ctx.status = 404
      ctx.body = {msg:'emmmmmmm, seems 404'};
    }
    ctx.body = user
  } catch (e) {
    ctx.status = 500
    ctx.body = 'Internal server error'
  }
})

user.patch('/:id', async ctx => {
  const updates = Object.keys(ctx.request.body)
  const allowedUpdates = ['username', 'email', 'password', 'age'] 
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update)) // sets validation rule for what can be edited in a user


  if (!isValidOperation) {
    ctx.status = 404
    ctx.body = 'Invalid updates'
  }
  try {
    const user = await User.findById(ctx.request.params.id) // The reason we go through this instead of just findAndUpdate is to allow the encryption middleware work on updating passwords
    updates.forEach((update) => user[update] = ctx.request.body[update])
    await user.save()

    if (!user) {
      ctx.status = 404
      ctx.body = 'emmmmm, seems this user does not exist'
    }

    ctx.body = user
  } catch (e) {
    ctx.status = 400
    ctx.body = e
  }
})

user.delete('/:id', async ctx => {
  try {
    const user = await User.findByIdAndDelete(ctx.request.params.id)
    if (!user) {
      ctx.status = 404
      ctx.body = 'emmmmm, seems this user does not exist'
    }
    ctx.body = user
  } catch (e) {
    ctx.status = 500
    ctx.body = 'Internal server error'
  }
})

module.exports = user
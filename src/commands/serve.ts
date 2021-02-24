import { Command, flags } from '@oclif/command'
import Koa, { Context, Next } from 'koa'
import Router from 'koa-router'

export default class Serve extends Command {
  static description = 'init icons config and directory'

  static flags = {
    help: flags.help({ char: 'h' }),
  }

  static args = []

  app = new Koa()
  router = new Router()

  async run() {
    const { app, router } = this

    router.get('/', async (ctx: Context, next: Next) => {
      ctx.body = 'hello'
    })

    app.use(router.routes()).use(router.allowedMethods())

    app.listen(4000, () => {
      console.log(`svg sprite is serving at http://localhost:4000`)
    })
  }
}

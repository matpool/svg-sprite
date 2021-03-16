import { Command, flags } from '@oclif/command'
import Koa, { Context, Next } from 'koa'
import Router from 'koa-router'
import serve from 'koa-static'
import multer from '@koa/multer'
import bodyParser from 'koa-bodyparser'
import cli from 'cli-ux'
import chalk from 'chalk'
import { writeFile, unlink, rename } from 'fs-extra'
import { resolve } from 'path'
import { historyApiFallback } from 'koa2-connect-history-api-fallback'

import { StaticGenerator } from '../core/StaticGenerator'
import { project } from '../core/Project'
import { SpriteResolver } from '../core/SpriteResolver'
import { CWD } from '../consts'

export default class Serve extends Command {
  static description = 'start a server to manage icons'

  static flags = {
    port: flags.integer({ char: 'p', default: 10086 }),
    help: flags.help({ char: 'h' }),
  }

  static args = []

  async run() {
    if (!project.inited) {
      throw new Error(
        `please run ${chalk.green('ss init')} first to init the icons project`
      )
    }

    const { flags } = this.parse(Serve)
    const app = new Koa()
    const router = new Router()
    const upload = multer()

    cli.action.start('file generating...')
    const generator = new StaticGenerator()
    await generator.generate()
    cli.action.stop()

    const resolver = new SpriteResolver()

    router.get('/api/sprites', async (ctx: Context, next: Next) => {
      ctx.body = (await resolver.resolve())
        .map((s) => s.value)
        .sort((a, b) => a.name.localeCompare(b.name))
      next()
    })

    router.get('/api/project', async (ctx: Context, next: Next) => {
      ctx.body = {
        root: project.root,
      }
      next()
    })

    router.post(
      '/api/sprites',
      upload.fields([
        {
          name: 'files',
        },
      ]),
      async (ctx: Context, next: Next) => {
        const { files } = (ctx as any).files
        const { type } = (ctx as any).request.body
        const dstPath = resolve(
          CWD,
          project.config?.[+type === 0 ? 'normal' : 'colorful']
        )
        await Promise.all(
          files.map((f) =>
            writeFile(resolve(dstPath, f.originalname), f.buffer, 'utf8')
          )
        )
        await generator.generate()
        ctx.body = 'ok'
        next()
      }
    )

    router.delete('/api/sprites', async (ctx: Context, next: Next) => {
      const { target } = ctx.request.query as { target: string }
      await unlink(target)
      await generator.generate()
      ctx.body = 'ok'
      next()
    })

    router.put('/api/sprites', async (ctx: Context, next: Next) => {
      const { src, dst } = (ctx.request as any).body
      await rename(src, dst)
      await generator.generate()
      ctx.body = 'ok'
      next()
    })

    app
      .use(historyApiFallback({ whiteList: ['/api'] }))
      .use(bodyParser())
      .use(router.routes())
      .use(router.allowedMethods())
      .use(serve(resolve(__dirname, '../../page/dist')))
      .use(serve(project.output))

    app.listen(flags.port, () => {
      const url = `http://localhost:${flags.port}`
      console.log(`svg sprite is serving at ${chalk.green(url)}`)
    })
  }
}

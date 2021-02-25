import { Command, flags } from '@oclif/command'
import Koa from 'koa'
import Router from 'koa-router'
import serve from 'koa-static'
import cli from 'cli-ux'
import chalk from 'chalk'

import { StaticGenerator } from '../core/StaticGenerator'
import { project } from '../core/Project'

export default class Serve extends Command {
  static description = 'start a server to manage icons'

  static flags = {
    port: flags.integer({ char: 'p', default: 10086 }),
    help: flags.help({ char: 'h' }),
  }

  static args = []

  app = new Koa()
  router = new Router()

  async run() {
    if (!project.inited) {
      throw new Error(
        `please run ${chalk.green('ss init')} first to init the icons project`
      )
    }

    const { flags } = this.parse(Serve)
    const { app, router } = this

    cli.action.start('file generating...')
    const generator = new StaticGenerator()
    await generator.generate()
    cli.action.stop()

    app
      .use(router.routes())
      .use(router.allowedMethods())
      .use(serve(project.output, { index: 'index.html' }))

    app.listen(flags.port, () => {
      const url = `http://localhost:${flags.port}`
      console.log(`svg sprite is serving at ${chalk.green(url)}`)
    })
  }
}

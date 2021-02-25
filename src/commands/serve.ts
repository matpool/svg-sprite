import { Command, flags } from '@oclif/command'
import Koa from 'koa'
import Router from 'koa-router'
import serve from 'koa-static'
import { resolve } from 'path'
import cli from 'cli-ux'
import chalk from 'chalk'

import { config, CWD } from '../consts'
import { StaticGenerator } from '../core/StaticGenerator'

export default class Serve extends Command {
  static description = 'init icons config and directory'

  static flags = {
    port: flags.integer({ char: 'p', default: 10086 }),
    help: flags.help({ char: 'h' }),
  }

  static args = []

  app = new Koa()
  router = new Router()
  outputDir = resolve(CWD, config?.paths?.output)
  generator = new StaticGenerator()

  async run() {
    const { flags } = this.parse(Serve)
    const { app, router } = this

    cli.action.start('file generating...')
    await this.generator.generate()
    cli.action.stop()

    app
      .use(router.routes())
      .use(router.allowedMethods())
      .use(serve(this.outputDir, { index: 'index.html' }))

    app.listen(flags.port, () => {
      const url = `http://localhost:${flags.port}`
      console.log(`svg sprite is serving at ${chalk.green(url)}`)
    })
  }
}

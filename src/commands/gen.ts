import { Command, flags } from '@oclif/command'
import cli from 'cli-ux'
import chalk from 'chalk'
import { project } from '../core/Project'
import { StaticGenerator } from '../core/StaticGenerator'

export default class Gen extends Command {
  static description = 'auto generate icon script and example html'

  static flags = {
    help: flags.help({ char: 'h' }),
  }

  static args = []

  async run() {
    if (!project.inited) {
      throw new Error(
        `please run ${chalk.green('ss init')} first to init the icons project`
      )
    }

    cli.action.start('file generating...')
    const generator = new StaticGenerator()
    await generator.generate()
    cli.action.stop()
  }
}

import { Command, flags } from '@oclif/command'
import cli from 'cli-ux'
import { StaticGenerator } from '../core/StaticGenerator'

export default class Gen extends Command {
  static description = 'auto generate icon script and example html'

  static flags = {
    help: flags.help({ char: 'h' }),
  }

  static args = []

  async run() {
    cli.action.start('file generating...')
    const generator = new StaticGenerator()
    await generator.generate()
    cli.action.stop()
  }
}

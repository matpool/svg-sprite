import { Command, flags } from '@oclif/command'
import { ensureDir, writeFile } from 'fs-extra'
import { resolve } from 'path'
import chalk from 'chalk'
import { project } from '../core/Project'
import { CWD, PROJECT_CONFIG_FILE } from '../consts'

export default class Init extends Command {
  static description = 'init icons config and directory'

  static flags = {
    help: flags.help({ char: 'h' }),
  }

  static args = []

  async run() {
    if (project.inited) {
      throw new Error(
        `icons project has been inited, please delete .iconrc and retry`
      )
    }

    const paths = ['./icons/normal', './icons/colorful', './icons/output']

    const projectConfigFileTemplate = `{
  "paths": {
    "normal": "./icons/normal",
    "colorful": "./icons/colorful",
    "output": "./icons/output"
  },
  "prefix": ""
}`

    for (let p of paths) {
      const pp = resolve(CWD, p)
      await ensureDir(pp)
    }

    await writeFile(
      resolve(CWD, PROJECT_CONFIG_FILE),
      projectConfigFileTemplate,
      'utf8'
    )

    console.log(chalk.green('init icons project successfully'))
  }
}

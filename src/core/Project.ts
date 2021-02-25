import { existsSync, readFileSync } from 'fs-extra'
import { resolve } from 'path'
import { CWD, PROJECT_CONFIG_FILE } from '../consts'

class Project {
  output = this.inited ? resolve(CWD, this.config.paths.output) : ''

  get root() {
    return CWD
  }

  get configFile() {
    return resolve(CWD, PROJECT_CONFIG_FILE)
  }

  get config() {
    if (!this.inited) {
      return
    }

    const configStr = readFileSync(this.configFile, 'utf8')
    let config: any = {}

    try {
      config = JSON.parse(configStr)
    } catch (e) {
      throw new Error(
        `icons config file ${PROJECT_CONFIG_FILE} is not a valid json file`
      )
    }

    if (
      !config?.paths?.normal ||
      !config?.paths?.colorful ||
      !config?.paths?.output
    ) {
      throw new Error(`config content invalid`)
    }

    return config
  }

  get inited() {
    return existsSync(this.configFile)
  }
}

export const project = new Project()

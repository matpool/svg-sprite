svg-icons-tool
==============

combine svg files to svg sprite

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/svg-icons-tool.svg)](https://npmjs.org/package/svg-icons-tool)
[![Downloads/week](https://img.shields.io/npm/dw/svg-icons-tool.svg)](https://npmjs.org/package/svg-icons-tool)
[![License](https://img.shields.io/npm/l/svg-icons-tool.svg)](https://github.com/TangGeG/svg-icons-tool/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g svg-icons-tool
$ sit COMMAND
running command...
$ sit (-v|--version|version)
svg-icons-tool/0.0.1 darwin-x64 node-v14.15.1
$ sit --help [COMMAND]
USAGE
  $ sit COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`sit gen`](#sit-gen)
* [`sit help [COMMAND]`](#sit-help-command)
* [`sit init`](#sit-init)

## `sit gen`

auto generate icon script and example html

```
USAGE
  $ sit gen

OPTIONS
  -h, --help  show CLI help
```

_See code: [src/commands/gen.ts](https://github.com/TangGeG/svg-icons-tool/blob/v0.0.1/src/commands/gen.ts)_

## `sit help [COMMAND]`

display help for sit

```
USAGE
  $ sit help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v3.2.2/src/commands/help.ts)_

## `sit init`

init icons config and directory

```
USAGE
  $ sit init

OPTIONS
  -h, --help  show CLI help
```

_See code: [src/commands/init.ts](https://github.com/TangGeG/svg-icons-tool/blob/v0.0.1/src/commands/init.ts)_
<!-- commandsstop -->

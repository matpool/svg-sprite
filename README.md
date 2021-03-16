# svg-sprite

combine svg files to svg sprite

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/@matpool/svg-sprite.svg)](https://www.npmjs.com/package/@matpool/svg-sprite)
[![Downloads/week](https://img.shields.io/npm/dw/@matpool/svg-sprite.svg)](https://npmjs.org/package/@matpool/svg-sprite)

[中文文档](https://gitee.com/btc8/dashboard/projects/btc8/svg-icons-tool/blob/master/doc.md)

<!-- toc -->
* [svg-sprite](#svg-sprite)
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->

# Usage

<!-- usage -->
```sh-session
$ npm install -g @matpool/svg-sprite
$ ss COMMAND
running command...
$ ss (-v|--version|version)
@matpool/svg-sprite/1.0.1 darwin-x64 node-v14.15.1
$ ss --help [COMMAND]
USAGE
  $ ss COMMAND
...
```
<!-- usagestop -->

# Commands

<!-- commands -->
* [`ss gen`](#ss-gen)
* [`ss help [COMMAND]`](#ss-help-command)
* [`ss init`](#ss-init)
* [`ss serve`](#ss-serve)

## `ss gen`

auto generate icon script and example html

```
USAGE
  $ ss gen

OPTIONS
  -h, --help  show CLI help
```

_See code: [src/commands/gen.ts](https://github.com/btc8/svg-icons-tool/blob/v1.0.1/src/commands/gen.ts)_

## `ss help [COMMAND]`

display help for ss

```
USAGE
  $ ss help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v3.2.2/src/commands/help.ts)_

## `ss init`

init icons config and directory

```
USAGE
  $ ss init

OPTIONS
  -h, --help  show CLI help
```

_See code: [src/commands/init.ts](https://github.com/btc8/svg-icons-tool/blob/v1.0.1/src/commands/init.ts)_

## `ss serve`

start a server to manage icons

```
USAGE
  $ ss serve

OPTIONS
  -h, --help       show CLI help
  -p, --port=port  [default: 10086]
```

_See code: [src/commands/serve.ts](https://github.com/btc8/svg-icons-tool/blob/v1.0.1/src/commands/serve.ts)_
<!-- commandsstop -->

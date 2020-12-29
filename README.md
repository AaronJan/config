# NestJS Any Config

<p align="center">
  <a href="https://github.com/aaronjan/nestjs-any-config"><img src="https://img.shields.io/github/tag/aaronjan/nestjs-any-config.svg" alt="GitHub tag (latest SemVer)" /></a>
  <a href="https://github.com/aaronjan/nestjs-any-config"><img src="https://github.com/aaronjan/nestjs-any-config/workflows/Node.js%20CI/badge.svg?branch=master" alt="Build status" /></a>
  <a href="https://github.com/aaronjan/nestjs-any-config"><img src="https://img.shields.io/github/license/aaronjan/nestjs-any-config.svg" alt="MIT" /></a>
</p>

## Description

This project is based on [`@nestjs/config`](https://github.com/nestjs/config), added JSON config and **custom config loader** support and kept original functions.

## Installation

```bash
$ npm i --save nestjs-any-config
```

## Quick Start

### Using env files

```javascript
import { Module } from '@nestjs/common';
import { ConfigModule } from 'nestjs-any-config';

@Module({
  imports: [
    ConfigModule.forRoot({
      type: 'env',
      envFile: {
        ignoreEnvVars: false,
        expandVariables: true,
      },
    }),
  ],
})
export class AppModule {}
```

### Using JSON files

```javascript
import { Module } from '@nestjs/common';
import { ConfigModule } from 'nestjs-any-config';

@Module({
  imports: [
    ConfigModule.forRoot({
      type: 'json',
      jsonFile: {
        filePath: [
          join(__dirname, 'config.local.json'),
          join(__dirname, 'config.json'),
        ],
      },
    }),
  ],
})
export class AppModule {}
```

### Using custom config file loader

You can using this method to load config from anywhere you want:

```javascript
import { Module } from '@nestjs/common';
import { ConfigModule } from 'nestjs-any-config';

@Module({
  imports: [
    ConfigModule.forRoot({
      type: 'custom',
      configLoader: async () => {
        // Do your thing here

        // return the config
        return {
          // ...
        }
      },
    }),
  ],
})
export class AppModule {}
```

## Credits

- Based on [`@nestjs/config`](https://github.com/nestjs/config)

## License

[MIT](LICENSE)

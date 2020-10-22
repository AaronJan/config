# NestJS Any Config

## Description

This project is based on [`@nestjs/config`](https://github.com/nestjs/config), added JSON config support and kept original functions.

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

## Credits

- Based on [`@nestjs/config`](https://github.com/nestjs/config)

## License

[MIT](LICENSE)

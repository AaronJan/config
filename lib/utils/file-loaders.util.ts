import { ConfigModuleOptions } from '../interfaces';
import { resolve } from 'path';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import dotenvExpand from 'dotenv-expand';

export function loadEnvFile(
  options: ConfigModuleOptions['envFile'] = {},
): Record<string, any> {
  const envFilePaths = Array.isArray(options.filePath)
    ? options.filePath
    : [options.filePath || resolve(process.cwd(), '.env')];

  const merged = envFilePaths
    .filter(filePath => fs.existsSync(filePath))
    .reduce((config, filePath) => {
      const merged = Object.assign(
        dotenv.parse(fs.readFileSync(filePath)),
        config,
      );

      if (options.expandVariables) {
        return dotenvExpand({ parsed: merged }).parsed || merged;
      } else {
        return merged;
      }
    }, <Record<string, any>>{});

  return options.ignoreEnvVars
    ? merged
    : {
        ...merged,
        ...process.env,
      };
}

export function loadJsonFile(
  options: ConfigModuleOptions['jsonFile'] = {},
): Record<string, any> {
  const jsonFilePaths = Array.isArray(options.filePath)
    ? options.filePath
    : [options.filePath || resolve(process.cwd(), 'config.json')];

  return jsonFilePaths
    .filter(filePath => fs.existsSync(filePath))
    .reduce(
      (config, filePath) =>
        Object.assign(
          JSON.parse(fs.readFileSync(filePath, options.encoding ?? 'utf8')),
          config,
        ),
      <Record<string, any>>{},
    );
}

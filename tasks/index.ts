import sequence from '@start/plugin-sequence'
import env from '@start/plugin-env'
import plugin from '@start/plugin'
import concurrent from './plugins/concurrent'

export * from '@apparatus/meta-start-preset'

export type TApp = {
  entryPointPath: string,
  htmlTemplatePath: string,
  assetsPath?: string,
  fontsDir?: string,
}

export const App = ({ entryPointPath, htmlTemplatePath, assetsPath, fontsDir }: TApp) => (...args: string[]) => {
  const platforms = args.length > 0 ? args : ['web', 'ios', 'android']

  return sequence(
    env({ NODE_ENV: 'development' }),
    platforms.includes('web') && plugin('web', ({ logMessage }) => async () => {
      const { runWebApp } = await import('@rebox/web')

      await runWebApp({
        entryPointPath,
        htmlTemplatePath,
        assetsPath,
        isQuiet: true,
      })

      logMessage('http://localhost:3000/')
    }),
    concurrent(
      platforms.includes('ios') && plugin('ios', () => async () => {
        const { runIosApp } = await import('@rebox/ios')

        await runIosApp({
          entryPointPath,
          appId: 'org.example.app',
          appName: 'App',
          iPhoneVersion: 8,
          iOSVersion: '13.2',
          fontsDir,
          dependencyNames: [
            '@react-native-community/async-storage',
          ],
        })
      }),
      platforms.includes('android') && plugin('android', () => async () => {
        const { runAndroidApp } = await import('@rebox/android')

        await runAndroidApp({
          entryPointPath,
          appId: 'org.example.app',
          appName: 'App',
          fontsDir,
          dependencyNames: [
            '@react-native-community/async-storage',
          ],
          portsToForward: [3001],
        })
      })
    )
  )
}

export const app = App({
  entryPointPath: './tasks/app/index.tsx',
  htmlTemplatePath: './tasks/app/templates/dev.html',
})

export const patchAsyncStorage = () => plugin('patchAsyncStorage', ({ logMessage, logPath }) => async () => {
  const { readFile, writeFile } = await import('pifs')
  const { resolve } = await import('path')

  const asyncStoragePackageJsonPath = resolve('node_modules', '@react-native-community', 'async-storage', 'package.json')

  const content = (await readFile(asyncStoragePackageJsonPath)).toString()

  logPath(asyncStoragePackageJsonPath)
  logMessage('patching async storage...')
  await writeFile(
    asyncStoragePackageJsonPath,
    content.replace('"react-native": "src/index.js",', '"react-native": "lib/module/index.js",')
  )
  logMessage('patched')
})

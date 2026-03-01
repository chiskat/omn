import { readdirSync, lstatSync, readlinkSync, copyFileSync, unlinkSync } from 'fs'
import { resolve, join } from 'path'

function processDir(dir) {
  for (const name of readdirSync(dir)) {
    const filePath = join(dir, name)
    const stat = lstatSync(filePath)

    if (stat.isSymbolicLink()) {
      const realPath = resolve(dir, readlinkSync(filePath))
      unlinkSync(filePath)
      copyFileSync(realPath, filePath)
    } else if (stat.isDirectory()) {
      processDir(filePath)
    }
  }
}

processDir(resolve(process.cwd(), './skills/how-to-use-omn/references'))

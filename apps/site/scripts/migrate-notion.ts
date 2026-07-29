import dotenv from 'dotenv'
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'

import { extractNotionMigrationItems, resolveNotionDataSourceIds } from '../src/lib/migrations/notion/extract'

async function main() {
  const args = new Map(
    process.argv.slice(2).map((argument) => {
      const [key, ...rest] = argument.split('=')
      return [key, rest.length ? rest.join('=') : 'true']
    }),
  )
  const projectDirectory = process.cwd()
  dotenv.config({ path: path.resolve(projectDirectory, args.get('--notion-env') || '../../.env.notion.local') })
  dotenv.config({ path: path.resolve(projectDirectory, '.env') })

  const apply = args.has('--apply')
  if (apply && args.get('--confirm') !== 'NOTION_TO_PAYLOAD') {
    throw new Error('Apply mode requires --confirm=NOTION_TO_PAYLOAD')
  }

  const startedAt = new Date().toISOString()
  const limitValue = Number(args.get('--limit'))
  const types = args.get('--types')
    ?.split(',')
    .map((value) => value.trim())
    .filter(Boolean)
  const extraction = await extractNotionMigrationItems({
    dataSourceIds: resolveNotionDataSourceIds(process.env),
    limit: Number.isFinite(limitValue) && limitValue > 0 ? limitValue : undefined,
    notionVersion: process.env.NOTION_API_VERSION,
    skipBlocks: args.has('--skip-blocks'),
    token: process.env.NOTION_API_TOKEN || '',
    types,
  })

  const { runNotionMigration } = await import('../src/lib/migrations/notion/runner')
  const entries = await runNotionMigration(extraction.items, apply)
  const counts = entries.reduce<Record<string, number>>((summary, entry) => {
    summary[entry.action] = (summary[entry.action] || 0) + 1
    return summary
  }, {})
  const finishedAt = new Date().toISOString()
  const runID = startedAt.replace(/[:.]/g, '-').replace('T', '_').replace('Z', '')
  const outputDirectory = path.resolve(projectDirectory, args.get('--output') || `migration-output/${runID}`)
  await mkdir(outputDirectory, { recursive: true })

  const manifest = {
    finishedAt,
    mode: apply ? 'apply' : 'dry-run',
    startedAt,
    entries,
  }
  const validationReport = {
    counts,
    dataSourceCount: extraction.dataSourceCount,
    errorCount: entries.reduce((total, entry) => total + entry.errors.length, 0),
    extractedPageCount: extraction.extractedPageCount,
    mediaCandidateCount: entries.reduce((total, entry) => total + entry.media.length, 0),
    sourcePageCount: extraction.sourcePageCount,
    warningCount: entries.reduce((total, entry) => total + entry.warnings.length, 0),
  }
  await Promise.all([
    writeFile(path.join(outputDirectory, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`),
    writeFile(
      path.join(outputDirectory, 'validation-report.json'),
      `${JSON.stringify(validationReport, null, 2)}\n`,
    ),
  ])

  console.log(
    JSON.stringify(
      {
        ...validationReport,
        mode: manifest.mode,
        outputDirectory,
      },
      null,
      2,
    ),
  )

  return entries.some((entry) => entry.action === 'error') ? 2 : 0
}

main()
  .then((code) => process.exit(code))
  .catch((error: unknown) => {
    console.error(error instanceof Error ? error.message : error)
    process.exit(1)
  })

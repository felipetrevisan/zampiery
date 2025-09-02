import { defineCliConfig, getStudioEnvironmentVariables } from 'sanity/cli'
import viteConfig from './vite.config'

const env = getStudioEnvironmentVariables()

const projectId = env.SANITY_STUDIO_PROJECT_ID
const dataset = env.SANITY_STUDIO_DATASET

export default defineCliConfig({
  api: { projectId, dataset },
  vite: viteConfig,
})

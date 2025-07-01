import type { GlobalConfig } from 'payload'
import Component from './Component'

const Database: GlobalConfig = {
  slug: 'database',
  label: 'データベース',
  admin: {
    group: 'データベース設定',
    components: {
      views: {
        // @ts-expect-error
        initialize: {
          Component: Component,
        },
      },
    },
  },
  access: {
    read: () => true,
  },
  fields: [],
}

export default Database 
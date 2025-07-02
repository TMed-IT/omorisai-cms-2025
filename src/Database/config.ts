import type { GlobalConfig } from 'payload'

const Database: GlobalConfig = {
  slug: 'database',
  label: 'データベース',
  admin: {
    group: 'データベース設定',
  },
  access: {
    read: () => true,
  },
  fields: [],
}

export default Database 
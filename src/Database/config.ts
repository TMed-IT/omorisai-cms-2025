import type { GlobalConfig } from 'payload'
import { isEditorOrAdmin } from '@/access/isEditorOrAdmin'

const Database: GlobalConfig = {
  slug: 'database',
  label: 'データベース',
  admin: {
    group: 'データベース設定',
  },
  access: {
    read: () => true,
    update: isEditorOrAdmin,
  },
  fields: [],
}

export default Database 
import { APIError } from 'payload'

export class EmailValidationError extends APIError {
  constructor(message: string) {
    super(message, 400, undefined, true)
  }
}

export class NameValidationError extends APIError {
  constructor(message: string) {
    super(message, 400, undefined, true)
  }
} 

export class AdminUserCannotBeChangedToEditorError extends APIError {
  constructor() {
    super('adminユーザーが0になるため、roleをeditorに変更できません', 400, undefined, true)
  }
}

export class EditorCannotEditUserDataError extends APIError {
  constructor() {
    super('編集者はユーザー情報を編集できません', 400, undefined, true)
  }
}

export class MediaExtensionNotAllowedError extends APIError {
  constructor(message: string) {
    super(message, 400, undefined, true)
  }
}

export class MediaFilenameInvalidError extends APIError {
  constructor(message: string) {
    super(message, 400, undefined, true)
  }
}
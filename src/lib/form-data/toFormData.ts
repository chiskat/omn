import { isPlainObject } from 'lodash-es'

import { metadataKey, type FormDataMetadata } from './_utils'
import { OmnError } from '../../misc/OmnError'

export interface ToFormDataOptions {
  /** 元数据字段名，默认为 `__OMN_META__` */
  metaField?: string

  /** 将普通字段值序列化为字符串，默认使用 `JSON.stringify` */
  stringify?: (value: unknown) => string
}

/**
 * 将可能包含表单文件的对象转换为 `FormData` 以便于传输
 *
 * 会保留并特殊处理 `File` 和 `Blob`，即使处于深层级字段；传输后可通过 `fromFormData` 按原样还原回对象。
 *
 * @param input  要转换的普通对象
 * @param options 可选的配置项
 * @returns 处理完成的 `FormData`
 * @see fromFormData
 * @example
 * const formData = toFormData({ user: { name: 'Ada' }, files: [file] })
 */
export function toFormData(input: Record<string, unknown>, options?: ToFormDataOptions): FormData {
  if (!isPlainObject(input)) {
    throw new OmnError(toFormData.name, '输入必须是普通对象。')
  }

  const metaField = options?.metaField ?? metadataKey
  if (typeof metaField !== 'string' || metaField.length === 0) {
    throw new OmnError(toFormData.name, '"metaField" 必须是非空字符串。')
  }
  const stringify = options?.stringify ?? JSON.stringify

  const formData = new FormData()
  const metadata: FormDataMetadata = { containers: [], files: [], undefinedValues: [] }

  const visit = (value: unknown, path: string): void => {
    if (typeof value === 'undefined') {
      metadata.undefinedValues.push(path)
      return
    }

    if (value instanceof Blob) {
      if (path === metaField) {
        throw new OmnError(toFormData.name, `"${metaField}" 是保留键，不能用作字段名。`)
      }
      formData.append(path, value)
      metadata.files.push(path)

      return
    }

    if (Array.isArray(value) || isPlainObject(value)) {
      if (path) {
        metadata.containers.push({ path, type: Array.isArray(value) ? 'array' : 'object' })
      }

      for (const [key, child] of Object.entries(value as Record<string, unknown>)) {
        const childPath = Array.isArray(value) ? `${path}[${key}]` : path ? `${path}.${key}` : key
        visit(child, childPath)
      }

      return
    }

    if (path === metaField) {
      throw new OmnError(toFormData.name, `"${metaField}" 是保留键，不能用作字段名。`)
    }

    let serialized: string | undefined
    try {
      serialized = stringify(value)
    } catch (error) {
      throw new OmnError(toFormData.name, `字段 "${path}" 的值无法序列化。`, {
        cause: error instanceof Error ? error : undefined,
      })
    }

    if (typeof serialized !== 'string') {
      throw new OmnError(toFormData.name, `字段 "${path}" 的序列化结果必须是字符串。`)
    }

    formData.append(path, serialized)
  }

  visit(input, '')
  formData.append(metaField, JSON.stringify(metadata))

  return formData
}

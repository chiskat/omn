import { set } from 'lodash-es'

import { metadataKey, type FormDataMetadata } from './_utils'
import { OmnError } from '../../misc/OmnError'

export interface FromFormDataOptions {
  /** 元数据字段名，默认为 `__OMN_META__` */
  metaField?: string

  /** 将普通字段字符串反序列化为字段值，默认使用 `JSON.parse` */
  parse?: (value: string) => unknown
}

/**
 * 将由 `toFormData` 创建的 FormData 还原为对象
 *
 * 保持原始的对象结构，且其中的 `File` 和 `Blob` 会按原样还原到相应的位置。
 *
 * @param input 由 `toFormData` 创建的 `FormData`
 * @param options 可选的配置项
 * @returns 还原后的对象
 * @see toFormData
 * @example
 * const value = fromFormData(formData)
 */
export function fromFormData<T extends Record<string, unknown> = Record<string, unknown>>(
  input: FormData,
  options?: FromFormDataOptions
): T {
  if (!(input instanceof FormData)) {
    throw new OmnError(fromFormData.name, '输入必须是 FormData 实例。')
  }

  const metaField = options?.metaField ?? metadataKey
  if (typeof metaField !== 'string' || metaField.length === 0) {
    throw new OmnError(fromFormData.name, '"metaField" 必须是非空字符串。')
  }
  const parse = options?.parse ?? JSON.parse

  const rawMetadata = input.get(metaField)
  if (typeof rawMetadata !== 'string') {
    throw new OmnError(fromFormData.name, `输入 FormData 缺少 "${metaField}" 元数据。`)
  }

  let metadata: FormDataMetadata
  try {
    metadata = JSON.parse(rawMetadata) as FormDataMetadata
  } catch (error) {
    throw new OmnError(fromFormData.name, `输入 FormData 中的 "${metaField}" 元数据无效。`, {
      cause: error instanceof Error ? error : undefined,
    })
  }

  if (
    !metadata ||
    typeof metadata !== 'object' ||
    !Array.isArray(metadata.containers) ||
    !Array.isArray(metadata.files) ||
    !Array.isArray(metadata.undefinedValues) ||
    !metadata.containers.every(
      container => typeof container?.path === 'string' && (container.type === 'array' || container.type === 'object')
    ) ||
    !metadata.files.every(path => typeof path === 'string') ||
    !metadata.undefinedValues.every(path => typeof path === 'string')
  ) {
    throw new OmnError(fromFormData.name, `输入 FormData 中的 "${metaField}" 元数据无效。`)
  }

  const result: Record<string, unknown> = {}
  for (const { path, type } of metadata.containers) {
    set(result, path, type === 'array' ? [] : {})
  }

  const filePaths = new Set(metadata.files)
  for (const [path, value] of input.entries()) {
    if (path === metaField) {
      continue
    }

    if (filePaths.has(path)) {
      set(result, path, value)
      continue
    }

    if (typeof value !== 'string') {
      throw new OmnError(fromFormData.name, `字段 "${path}" 中出现了未预期的文件值。`)
    }

    try {
      set(result, path, parse(value))
    } catch (error) {
      throw new OmnError(fromFormData.name, `输入 FormData 中字段 "${path}" 的值无效。`, {
        cause: error instanceof Error ? error : undefined,
      })
    }
  }

  for (const path of metadata.undefinedValues) {
    set(result, path, undefined)
  }

  return result as T
}

export const metadataKey = '__OMN_META__'

export interface FormDataMetadata {
  containers: Array<{ path: string; type: 'array' | 'object' }>
  files: string[]
  undefinedValues: string[]
}

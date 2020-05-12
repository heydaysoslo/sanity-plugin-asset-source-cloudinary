export default [
  {
    name: 'bytes',
    title: 'bytes',
    type: 'number'
  },
  {
    name: 'created_at',
    title: 'Created At',
    type: 'string'
  },
  {
    name: 'duration',
    title: 'Duration',
    type: 'number'
  },
  {
    name: 'format',
    title: 'Format',
    type: 'string'
  },
  {
    name: 'height',
    title: 'Height',
    type: 'number'
  },
  {
    name: 'width',
    title: 'Width',
    type: 'number'
  },
  {
    name: 'aspectRatio',
    title: 'Aspect Ratio',
    type: 'number'
  },
  {
    name: 'metadata',
    title: 'Metadata',
    type: 'array',
    of: [
      {
        name: 'data',
        title: 'Data',
        type: 'string'
      }
    ]
  },
  {
    name: 'public_id',
    title: 'Public Id',
    type: 'string'
  },
  {
    name: 'resource_type',
    title: 'Resource Type',
    type: 'string'
  },
  {
    name: 'secure_url',
    title: 'Secure Url',
    type: 'string'
  },
  {
    name: 'tags',
    title: 'Tags',
    type: 'array',
    of: [
      {
        name: 'tag',
        title: 'Tag',
        type: 'string'
      }
    ]
  },
  {
    name: 'type',
    title: 'Type',
    type: 'string'
  },
  {
    name: 'url',
    title: 'Url',
    type: 'string'
  },
  {
    name: 'version',
    title: 'Version',
    type: 'number'
  }
]

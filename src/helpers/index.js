import pluginConfig from 'config:asset-source-cloudinary'

export const getCloudinaryImageSource = (
  { public_id, format, resource_type, type },
  { width, height }
) => {
  let transformations = ''
  if (format !== 'gif') {
    transformations = '/f_auto,q_auto'
    if (width) {
      transformations += `,w_${width}`
    }
    if (height) {
      transformations += `,h_${height}`
    }
    if (width && height) {
      transformations += `,c_fill`
    }
  }
  return `https://res.cloudinary.com/${pluginConfig.cloudName}/${resource_type}/${type}${transformations}/${public_id}`
}

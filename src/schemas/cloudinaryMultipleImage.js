import React from 'react'
import CloudinaryAssetSource from '../components/Wrapper'
import Icon from '../components/Icon'
import cloudinaryAsset from './cloudinaryAsset'

export default {
  name: 'cloudinaryMultipleImage',
  title: 'Images',
  type: 'object',
  icon: Icon,
  fields: [
    {
      name: 'images',
      title: 'Images',
      type: 'array',
      options: {
        layout: 'grid'
      },
      inputComponent: props => (
        <CloudinaryAssetSource selectionType="multiple" resourceType="image" {...props} />
      ),
      of: [
        {
          name: 'cldimage',
          title: 'Image',
          type: 'cloudinarySingleImage'
        }
      ]
    }
  ]
}

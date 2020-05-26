import React from 'react'
import CloudinaryAssetSource from '../components/Wrapper'
import Icon from '../components/Icon'
import cloudinaryAsset from './cloudinaryAsset'
import cloudinarySingleVideo from './cloudinarySingleVideo'

export default {
  name: 'cloudinaryMultipleVideo',
  title: 'Video',
  type: 'object',
  icon: Icon,
  fields: [
    {
      name: 'videos',
      title: 'Videos',
      type: 'array',
      inputComponent: props => (
        <CloudinaryAssetSource selectionType="multiple" resourceType="video" {...props} />
      ),
      of: [
        {
          name: 'video',
          title: 'Video',
          type: 'cloudinarySingleVideo'
        }
      ]
    }
  ]
}

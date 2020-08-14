import React from 'react'
import CloudinaryAssetSource from '../components/Wrapper'
import Icon from '../components/Icon'
import { getCloudinaryImageSource } from '../helpers'
import cloudinaryAsset from './cloudinaryAsset'

export default {
  name: 'cloudinaryMedia',
  title: 'Cloudinary media',
  type: 'object',
  inputComponent: props => {
    const resourceType = (props.type.options && props.type.options.resourceType) || 'any'
    const selectionType = (props.type.options && props.type.options.selectionType) || 'single'
    return (
      <CloudinaryAssetSource resourceType={resourceType} selectionType={selectionType} {...props} />
    )
  },
  icon: Icon,
  fields: cloudinaryAsset,
  preview: {
    select: {
      media: 'cloudinaryAsset'
    },
    prepare({ media }) {
      const newMedia = media
        ? getCloudinaryImageSource(media, {
            width: 200,
            height: 200
          })
        : ''
      return {
        title: media.public_id || 'No image',
        media: <img src={newMedia} alt="" />
      }
    }
  }
}

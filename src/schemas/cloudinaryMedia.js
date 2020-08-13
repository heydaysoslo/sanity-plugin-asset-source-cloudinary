import React from 'react'
import CloudinaryAssetSource from '../components/Wrapper'
import Icon from '../components/Icon'
import { getCloudinaryImageSource } from '../helpers'

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
  fields: [
    {
      name: 'media',
      title: 'media',
      type: 'media'
    }
  ],
  preview: {
    select: {
      media: 'media'
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

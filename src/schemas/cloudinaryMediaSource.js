import React from 'react'
import CloudinaryAssetSource from '../components/Wrapper'
import Icon from '../components/Icon'
import cloudinaryAsset from './cloudinaryAsset'

export default {
  name: 'cloudinaryMediaSource',
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
  fields: cloudinaryAsset
}

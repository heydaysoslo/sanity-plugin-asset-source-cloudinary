import React from 'react'
import CloudinaryAssetSource from '../components/Wrapper'
import Icon from '../components/Icon'
import cloudinaryAsset from './cloudinaryAsset'

export default {
  name: 'cloudinarySingleImage',
  title: 'Image',
  type: 'object',
  inputComponent: props => (
    <CloudinaryAssetSource selectionType="single" resourceType="image" {...props} />
  ),
  icon: Icon,
  fields: cloudinaryAsset
}

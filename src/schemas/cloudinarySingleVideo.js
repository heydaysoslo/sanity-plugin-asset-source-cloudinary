import React from 'react'
import CloudinaryAssetSource from '../components/Wrapper'
import Icon from '../components/Icon'
import cloudinaryAsset from './cloudinaryAsset'

export default {
  name: 'cloudinarySingleVideo',
  title: 'Video',
  type: 'object',
  inputComponent: props => (
    <CloudinaryAssetSource selectionType="single" resourceType="video" {...props} />
  ),
  icon: Icon,
  fields: cloudinaryAsset
}

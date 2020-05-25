/* eslint-disable camelcase */
import React from 'react'
import Dialog from 'part:@sanity/components/dialogs/fullscreen'
import Spinner from 'part:@sanity/components/loading/spinner'
import pluginConfig from 'config:asset-source-cloudinary'
import sha256 from 'crypto-js/sha256'
import encode from 'crypto-js/enc-hex'

import { Asset, AssetDocument, CloudinaryAsset, CloudinaryMediaLibrary } from '../types'
import { loadCloudinary, decodeSourceId, encodeFilename, encodeSourceId } from '../utils'
import styles from './CloudinaryAssetSource.css'

declare global {
  interface Window {
    cloudinary: any
  }
}

const getUnixTime = () => {
  return Math.round(new Date().getTime() / 1000)
}

window.cloudinary = window.cloudinary || {}

type Props = {
  onSelect: (assets: Asset[]) => void
  onClose: () => void
  selectedAssets?: AssetDocument[]
  selectionType: 'single' | 'multiple'
  resourceType: 'video' | 'image'
}

type State = {
  loadingMessage: string | null
  hasConfig: boolean
}

export default class CloudinaryAssetSource extends React.Component<Props, State> {
  static defaultProps = {
    selectedAssets: undefined,
    resourceType: 'image'
  }

  state = {
    loadingMessage: 'Loading Cloudinary Media Libary',
    hasConfig: false
  }

  private contentRef = React.createRef<HTMLDivElement>()

  private library: CloudinaryMediaLibrary | null = null

  private domId = Date.now()

  componentDidMount() {
    const hasConfig = !!(pluginConfig.cloudName && pluginConfig.apiKey)
    this.setState({ hasConfig }, () => hasConfig && loadCloudinary(this.setupMediaLibrary))
  }

  private setupMediaLibrary = () => {
    const { selectedAssets, selectionType } = this.props
    const firstSelectedAsset = selectedAssets ? selectedAssets[0] : null
    // Check if credentials are provided
    const hasCredentials = pluginConfig.username && pluginConfig.secret
    let credentials = {}
    // If credentials are provided. Generate login encryption
    // https://cloudinary.com/documentation/media_library_widget#2_optional_generate_the_authentication_signature
    if (hasCredentials) {
      credentials = {
        username: pluginConfig.username,
        timestamp: getUnixTime(),
        signature: sha256(
          `cloud_name=${pluginConfig.cloudName}&timestamp=${getUnixTime()}&username=${
            pluginConfig.username
          }${pluginConfig.secret}`
        ).toString(encode)
      }
    }
    this.library = window.cloudinary.createMediaLibrary(
      {
        cloud_name: pluginConfig.cloudName,
        api_key: pluginConfig.apiKey,
        ...credentials,
        inline_container: `#cloundinaryWidget-${this.domId}`,
        remove_header: true,
        insert_caption: 'Select'
      },
      {
        insertHandler: this.handleSelect
      }
    )
    const iframe: ChildNode | null = this.contentRef.current && this.contentRef.current.firstChild
    if (iframe && iframe instanceof HTMLIFrameElement) {
      iframe.onload = () => {
        this.setState({ loadingMessage: null })
        let asset
        if (
          selectionType === 'single' &&
          firstSelectedAsset &&
          firstSelectedAsset.source &&
          firstSelectedAsset.source.id
        ) {
          asset = decodeSourceId(firstSelectedAsset.source.id)
        }
        const folder = asset
          ? {
              path: asset.public_id
                .split('/')
                .slice(0, -1)
                .join('/'),
              resource_type: this.props.resourceType
            }
          : { path: '', resource_type: this.props.resourceType }
        if (this.library && this.contentRef.current) {
          this.library.show({ folder, asset })
          this.contentRef.current.style.visibility = 'visible'
        }
      }
    }
  }

  handleSelect = ({ assets }: any) => {
    if (!this.library) {
      return
    }
    const imageAssets = assets.filter((asset: CloudinaryAsset) => asset.resource_type === 'image')
    const videoAssets = assets.filter((asset: CloudinaryAsset) => asset.resource_type === 'video')
    if (imageAssets.length === 0 && videoAssets.length === 0) {
      throw new Error('The selection did not contain any images or videos.')
    }
    this.library.hide()
    this.props.onSelect(
      [...imageAssets, ...videoAssets].map((asset: CloudinaryAsset) => {
        console.log(asset)
        const url =
          asset.derived && asset.derived[0] ? asset.derived[0].secure_url : asset.secure_url
        return {
          ...asset,
          kind: 'url',
          value: url,
          assetDocumentProps: {
            originalFilename: encodeFilename(asset),
            source: {
              id: encodeSourceId(asset),
              name: `cloudinary:${pluginConfig.cloudName}`
            }
          }
        }
      })
    )
  }

  handleClose = () => {
    if (this.library) {
      this.library.hide()
    }
    this.props.onClose()
  }

  renderConfigWarning() {
    return (
      <div>
        <h2>Missing configuration</h2>
        <p>You must first configure the plugin with your Cloudinary credentials</p>
        <p>
          Edit the <code>./config/asset-source-cloudinary.json</code> file in your Sanity Studio
          folder.
        </p>
        <p>
          You can get your credentials by visiting the{' '}
          <a href="https://cloudinary.com/console" rel="noopener noreferrer" target="_blank">
            Cloudinary console
          </a>{' '}
          and get your Cloud name and API key.
        </p>
      </div>
    )
  }

  render() {
    const { hasConfig, loadingMessage } = this.state
    return (
      <Dialog title="Select image from Cloudinary" onClose={this.handleClose} isOpen>
        {hasConfig && loadingMessage && <Spinner fullscreen center message={loadingMessage} />}
        {hasConfig && (
          <div
            style={{ visibility: 'hidden' }}
            ref={this.contentRef}
            className={styles.widget}
            id={`cloundinaryWidget-${this.domId}`}
          />
        )}
        {!hasConfig && this.renderConfigWarning()}
      </Dialog>
    )
  }
}

import React from 'react'
import MediaPreview from 'part:@sanity/components/previews/media'
import styles from './CloudinaryPreview.css'
import { getCloudinaryImageSource } from '../helpers/index.js'

const CloudinaryPreview = ({ value }) => {
  if (!value) return null
  // handle possible data structures
  // value || value.media
  const item = value.hasOwnProperty('media') ? value.media : value
  return (
    <div className="CloudinaryPreview">
      {item.resource_type === 'video' && (
        <video controls style={{ maxWidth: '100%' }}>
          <source src={item.value} />
        </video>
      )}
      {item.resource_type === 'image' && (
        <div className={styles.ImageBackdrop}>
          <div style={{ width: '100%', maxWidth: '460px', margin: '0 auto' }}>
            <MediaPreview
              media={
                <img
                  src={getCloudinaryImageSource(item, {
                    width: 920
                  })}
                />
              }
              mediaDimensions={{
                aspect: item.aspectRatio
              }}
              title={item.public_id}
              subtitle={`Cloudinary ${item.resource_type}`}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default CloudinaryPreview

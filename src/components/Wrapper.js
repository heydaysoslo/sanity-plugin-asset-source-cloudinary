import React, { useState, useEffect } from 'react'
import Button from 'part:@sanity/components/buttons/default'
import ButtonGrid from 'part:@sanity/components/buttons/button-grid'
import Fieldset from 'part:@sanity/components/fieldsets/default'
import MediaPreview from 'part:@sanity/components/previews/media'
import CloudinaryAssetSource from './CloudinaryAssetSource'
import PatchEvent, { set, unset } from 'part:@sanity/form-builder/patch-event'
import { setIfMissing } from 'part:@sanity/form-builder/patch-event'
import { List, Item } from 'part:@sanity/components/lists/sortable-grid'
import { arrayMove } from 'react-sortable-hoc'
import { v1 as uuid } from 'uuid'

import styles from './Wrapper.css'
console.log('styles', styles)

import Icon from './Icon'

const createPatchFrom = value => PatchEvent.from(!value ? unset() : set(value))

const Wrapper = ({ type, value, markers, selectionType, resourceType, onChange }) => {
  console.log('fired', type)
  const [open, setOpen] = useState(false)
  const [items, setItems] = useState([])
  const resolveValues = vals => {
    if (!vals || vals === null || !Array.isArray(vals)) {
      return null
    } else {
      // handle multiple selection
      if (selectionType === 'multiple') {
        if (Array.isArray(value)) {
          return [
            ...value,
            ...vals.map(val => ({ ...val, _key: uuid(), aspectRatio: val.width / val.height }))
          ]
        } else {
          return vals.map(val => ({ ...val, _key: uuid(), aspectRatio: val.width / val.height }))
        }
      } else {
        // handle single selection
        return { ...vals[0], _key: uuid(), aspectRatio: vals[0].width / vals[0].height }
      }
    }
  }

  const handleSelect = vals => {
    onChange(createPatchFrom(resolveValues(vals)).prepend(setIfMissing({ _type: type.name })))
    // Hide cloudinary GUI
    setOpen(false)
    // Return null if no value
    return vals ? vals[0] : null
  }

  const handleSort = ({ oldIndex, newIndex }) => {
    // Update value on sort
    onChange(
      createPatchFrom(arrayMove(items, oldIndex, newIndex)).prepend(
        setIfMissing({ _type: type.name })
      )
    )
  }

  const handleDelete = key => {
    // Filter out removed item
    const newValue = [...value].filter(val => val._key !== key)
    // Set new items to state
    setItems(newValue)
    // Update value with the new values
    onChange(createPatchFrom(newValue).prepend(setIfMissing({ _type: type.name })))
  }

  useEffect(() => {
    // Set items array if multiselect
    if (Array.isArray(value) && value.length > 0) {
      setItems(value)
    }
  }, [value])

  return (
    <Fieldset legend={type.title} description={type.description} markers={markers}>
      {value && Array.isArray(value) && value[0] && (
        <List className="myGridList" onSortEnd={handleSort}>
          {items &&
            items.length > 0 &&
            items.map((item, index) => (
              <Item key={item._key} index={index}>
                <div style={{ position: 'relative' }}>
                  <MediaPreview
                    media={
                      item.resource_type === 'video' ? (
                        <video controls style={{ maxWidth: '100%', width: '100%' }}>
                          <source src={item.url} />
                        </video>
                      ) : (
                        <img src={item.url.replace('/upload', '/upload/w_160,h_160,c_fill/')} />
                      )
                    }
                    mediaDimensions={{
                      aspect: 1
                    }}
                    title={item.public_id}
                    subtitle={`Cloudinary ${item.resource_type}`}
                  />
                  <div className={styles.DeleteButton}>
                    <Button
                      onClick={() => handleDelete(item._key)}
                      icon={() => (
                        <span role="img" aria-label="delete">
                          ❌
                        </span>
                      )}
                    />
                  </div>
                </div>
              </Item>
            ))}
        </List>
      )}
      {value && value.resource_type === 'video' && (
        <video controls style={{ maxWidth: '100%' }}>
          <source src={value.value} />
        </video>
      )}
      {value && value.resource_type === 'image' && (
        <div className={styles.ImageBackdrop}>
          <div style={{ height: '460px', width: `${value.aspectRatio * 460}px`, margin: '0 auto' }}>
            <MediaPreview
              media={<img src={value.url.replace('/upload', '/upload/h_920,c_fill/')} />}
              mediaDimensions={{
                aspect: value.aspectRatio
              }}
              title={value.public_id}
              subtitle={`Cloudinary ${value.resource_type}`}
            />
          </div>
        </div>
      )}
      {/* {value && <pre>{JSON.stringify(value, null, 2)}</pre>} */}
      {open && (
        <CloudinaryAssetSource
          onClose={() => setOpen(false)}
          onSelect={handleSelect}
          selectionType={selectionType}
          resourceType={resourceType}
        />
      )}
      <div
        style={{
          marginTop:
            (value && value.hasOwnProperty('value')) ||
            (value && Array.isArray(value) && value.length > 0)
              ? '1rem'
              : '0px'
        }}
      >
        <ButtonGrid align="start">
          <Button onClick={() => setOpen(open => !open)} icon={Icon} kind="secondary">
            Select/Upload
          </Button>
          {value && (
            <Button onClick={() => handleSelect(null)} kind="secondary" color="danger">
              Remove {selectionType === 'multiple' && 'all'}
            </Button>
          )}
        </ButtonGrid>
      </div>
    </Fieldset>
  )
}

export default Wrapper

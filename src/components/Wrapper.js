import React, { useState, useEffect } from 'react'
import { useDocumentOperation } from '@sanity/react-hooks'
import Button from 'part:@sanity/components/buttons/default'
import ButtonGrid from 'part:@sanity/components/buttons/button-grid'
import Fieldset from 'part:@sanity/components/fieldsets/default'
import CloudinaryAssetSource from './CloudinaryAssetSource'
import PatchEvent, { set, unset } from 'part:@sanity/form-builder/patch-event'
import { withDocument } from 'part:@sanity/form-builder'
import { setIfMissing } from 'part:@sanity/form-builder/patch-event'
import uuid from '@sanity/uuid'

import Icon from './Icon'
import CloudinaryPreview from './CloudinaryPreview'

const createPatchFrom = value => PatchEvent.from(!value ? unset() : set(value))

const getOriginalDocumentId = id => {
  if (id.indexOf('drafts.') !== -1) {
    return id.split('drafts.')[1]
  }
  return id
}

const Wrapper = ({ type, value, markers, selectionType, resourceType, onChange, document }) => {
  const [open, setOpen] = useState(false)
  // https://www.sanity.io/docs/studio-react-hooks
  const { patch } = useDocumentOperation(getOriginalDocumentId(document._id), document._type)

  const resolveValues = vals => {
    // console.log('TYPE', type)
    // console.log('VALS', vals)
    // console.log('VALUE', value)
    // console.log('Patch operation', patch)
    // Spread items to array
    const { options } = type
    if (vals && Array.isArray(vals) && options && options.distribute) {
      const { arrayName, parentName } = options.distribute
      if (arrayName && parentName) {
        const lastItem = vals.pop()
        if (vals.length) {
          const insertItems = vals.map(item => {
            return {
              _key: uuid(),
              _type: parentName,
              media: { ...item, _key: uuid(), aspectRatio: item.width / item.height }
            }
          })
          // https://www.sanity.io/docs/http-patches#appending-Cw4vhD88
          patch.execute([
            {
              insert: {
                after: `${arrayName}[-1]`,
                items: insertItems
              }
            }
          ])
        }
        return { ...lastItem, _key: uuid(), aspectRatio: lastItem.width / lastItem.height }
      }
    }

    if (!vals || vals === null || !Array.isArray(vals)) {
      return null
    }

    if (type.name === 'cloudinaryMedia') {
      return { ...vals[0], _key: uuid(), aspectRatio: vals[0].width / vals[0].height }
    }
  }

  const handleSelect = vals => {
    onChange(createPatchFrom(resolveValues(vals)).prepend(setIfMissing({ _type: type.name })))
    // Hide cloudinary GUI
    setOpen(false)
    // // Return null if no value
    // return vals ? vals[0] : null
  }

  return (
    <Fieldset legend={type.title} description={type.description} markers={markers}>
      <CloudinaryPreview value={value} />
      {open && (
        <CloudinaryAssetSource
          onClose={() => setOpen(false)}
          onSelect={handleSelect}
          selectionType={selectionType}
          resourceType={resourceType}
          forField={type.title}
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
              Remove{' '}
              {selectionType === 'multiple' && Array.isArray(value) && value.length > 1 && 'all'}
            </Button>
          )}
        </ButtonGrid>
      </div>
    </Fieldset>
  )
}

export default withDocument(Wrapper)

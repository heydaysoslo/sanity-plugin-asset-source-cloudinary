import schemaTypes from 'all:part:@sanity/base/schema-type'
console.log('schemaTypes', schemaTypes)

import cloudinarySingleImage from './cloudinarySingleImage'
import cloudinarySingleVideo from './cloudinarySingleVideo'
import cloudinaryMultipleImage from './cloudinaryMultipleImage'
import cloudinaryMultipleVideo from './cloudinaryMultipleVideo'

// Then we give our schema to the builder and provide the result to Sanity
// export default {
//   cloudinarySingleImage,
//   cloudinarySingleVideo,
//   cloudinaryMultipleImage,
//   cloudinaryMultipleVideo
// }

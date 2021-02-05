import { merge } from 'lodash'
import BookResolvers from './Book'
import AuthorResolvers from './Author'

export default merge(
	BookResolvers,
	AuthorResolvers
)

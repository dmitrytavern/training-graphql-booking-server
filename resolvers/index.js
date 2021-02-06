import { merge } from 'lodash'
import AuthResolvers from "./Auth"
import BookResolvers from './Book'
import AuthorResolvers from './Author'

export default merge(
	AuthResolvers,
	BookResolvers,
	AuthorResolvers
)

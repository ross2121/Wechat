import { UnAuthenticatedError } from '../errors/index.js'

const checkPermissions = (requestUser, resourceUserId) => {
  if (resourceUserId.toString() !== requestUser.id) return

  throw new UnAuthenticatedError('Not authorized to access this route')
}

export default checkPermissions

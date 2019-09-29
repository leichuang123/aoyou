
import { TEST_ISINCOGNITOMODE } from '../constants/storage_key'

export const isIncognitoMode = () => {
  try {
    localStorage.setItem(TEST_ISINCOGNITOMODE, 'aoyou')
    return false
  } catch (e) {
    console.log(e)
    return true
  }
}
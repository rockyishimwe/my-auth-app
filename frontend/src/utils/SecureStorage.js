

class SecureStorage {
 
  static encryptionKey = 'GoalSetter_Secret_Key_2024'

  
  static encode(data) {
    try {
      const jsonString = JSON.stringify(data)
      return btoa(encodeURIComponent(jsonString))
    } catch (error) {
      console.error('Encryption error:', error)
      return null
    }
  }

  
  static decode(encodedData) {
    try {
      const decoded = decodeURIComponent(atob(encodedData))
      return JSON.parse(decoded)
    } catch (error) {
      console.error('Decryption error:', error)
      return null
    }
  }

  
  static xorCipher(str, key) {
    let result = ''
    for (let i = 0; i < str.length; i++) {
      result += String.fromCharCode(str.charCodeAt(i) ^ key.charCodeAt(i % key.length))
    }
    return result
  }

 
  static setItem(key, value) {
    try {
      const jsonString = JSON.stringify(value)
      const xored = this.xorCipher(jsonString, this.encryptionKey)
      const encoded = btoa(xored)
      localStorage.setItem(key, encoded)
      return true
    } catch (error) {
      console.error('Storage error:', error)
      return false
    }
  }

  
  static getItem(key) {
    try {
      const encoded = localStorage.getItem(key)
      if (!encoded) return null
      
      const decoded = atob(encoded)
      const xored = this.xorCipher(decoded, this.encryptionKey)
      return JSON.parse(xored)
    } catch (error) {
      console.error('Retrieval error:', error)
      return null
    }
  }

  
  static removeItem(key) {
    try {
      localStorage.removeItem(key)
      return true
    } catch (error) {
      console.error('Removal error:', error)
      return false
    }
  }

  
  static clear() {
    try {
      localStorage.clear()
      return true
    } catch (error) {
      console.error('Clear error:', error)
      return false
    }
  }
}


export default SecureStorage;
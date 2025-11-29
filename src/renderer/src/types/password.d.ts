interface Pagination {
  currentPage: number
  pageSize: number
  total: number
  totalPages: number
}

interface Category {
  id: string
  name: string
  icon: string
  color: string
}

interface PasswordItem {
  id: string
  title: string
  username: string
  password: string
  encryptedPassword: string
  passwordStrength: number
  isFavorite: boolean
  showPassword: boolean
  category: Category
}

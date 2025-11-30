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

interface PasswordForm {
  categoryId?: string
  title: string
  username: string
  password: string
  url: string
  notes: string
}

interface CollectionPassword {
  id: string
  url: string
  title: string
  username: string
  password: string
  encryptedPassword: string
  passwordStrength: number
  notes: string
  isFavorite: boolean
  lastUsed: Date | null
  createdAt: Date
  updatedAt: Date
  category: Category
  decryptedPassword: string
}

interface TrashPassword {
  id: string
  title: string
  username: string
  lastUsed: Date | null
  deletedAt: Date | null
}

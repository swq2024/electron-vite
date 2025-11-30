interface CategoryItem {
  id: string
  userId: string
  name: string
  color: string
  icon: string
  isDefault: boolean
  passwordCount: number
  createdAt: Date
  updatedAt: Date
}

interface CategoryForm {
  id: string
  name: string
  color: string
  icon: string
  readonly isDefault?: boolean
}

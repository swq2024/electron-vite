import { DataSource } from 'typeorm'
import { User } from './entities/user/user'

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: '123456',
  database: 'test',
  logger: 'debug', // 启用调试日志模式
  synchronize: true, // 自动同步实体到数据库, 生产环境禁用
  entities: [User]
})

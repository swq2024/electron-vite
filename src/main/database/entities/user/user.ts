import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'varchar', length: 255, nullable: false })
  name: string

  @Column({ type: 'int' })
  age: number

  @Column({ type: 'varchar', nullable: true })
  hobby: string
}

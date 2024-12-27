import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, RelationId, Unique } from "typeorm";
import { Investment } from "./Investment";
import { Static, Type } from "@sinclair/typebox";

@Entity()
@Unique(["email"])
export class User {
  
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  balance: number;

  @OneToMany(() => Investment, investment => investment.user)
  investments: Promise<Investment[]>;

  @RelationId((user: User) => user.investments)
  investmentIds: number[];

  @CreateDateColumn()
  created_at: Date;
  
}

export const UserSchema = Type.Object({
  id: Type.Number(),
  name: Type.String(),
  email: Type.String(),
  balance: Type.Number(),
  created_at: Type.String({ format: "date-time" }),
  investmentIds: Type.Array(Type.Number()),
  total_investment: Type.Optional(Type.Number())
})

export type UserType = Static<typeof UserSchema>
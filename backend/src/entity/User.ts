import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, RelationId, Unique } from "typeorm";
import { Equity, EquitySchema } from "./Investment";
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

  @Column({default: 1000})
  balance: number;

  @OneToMany(() => Equity, investment => investment.user)
  investments: Equity[];

  @RelationId((user: User) => user.investments)
  investmentIds: number[];

  @CreateDateColumn()
  created_at: Date;
  
  // Not a column
  net_worth?: number;
}

export const UserSchema = Type.Object({
  id: Type.Number(),
  name: Type.String(),
  email: Type.String(),
  balance: Type.Number(),
  created_at: Type.String({ format: "date-time" }),
  investmentIds: Type.Array(Type.Number()),
  net_worth: Type.Optional(Type.Number())
})

export const ExtendedUserSchema = Type.Object({
  id: Type.Number(),
  name: Type.String(),
  email: Type.String(),
  balance: Type.Number(),
  created_at: Type.String({ format: "date-time" }),
  investments: Type.Array(Type.Composite([
    Type.Pick(EquitySchema, ['id', 'amount', 'equity']),
    Type.Object({
      startup: Type.Object({
        id: Type.Number(),
        name: Type.String(),
        valuation: Type.Number()
      })
    })
  ])),
  net_worth: Type.Optional(Type.Number())
})

export type UserType = Static<typeof UserSchema>
export type ExtendedUserType = Static<typeof ExtendedUserSchema>
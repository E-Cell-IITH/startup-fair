import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Equity } from "./Investment";
import { Type, Static } from "@sinclair/typebox";

@Entity()
export class Startup {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  icon: string;

  @Column('double precision', {default: 0})
  equity_sold: number;

  @Column()
  valuation: number;

  @OneToMany(() => Equity, investment => investment.startup)
  investments: Equity;

}

export const StartupSchema = Type.Object({
  id: Type.Number(),
  name: Type.String(),
  icon: Type.String(),
  equity_sold: Type.Number(),
  valuation: Type.Number()
})

export type StartupType = Static<typeof StartupSchema>
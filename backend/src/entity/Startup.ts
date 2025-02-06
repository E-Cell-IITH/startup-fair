import { Column, Entity, OneToMany, PrimaryColumn, PrimaryGeneratedColumn, Unique } from "typeorm";
import { Equity } from "./Investment.js";
import { Type, Static } from "@sinclair/typebox";

@Entity()
@Unique(["name"])
export class Startup {

  @PrimaryColumn()
  id: string;

  @Column()
  name: string;

  @Column()
  icon: string;

  @Column('double precision', {default: 0})
  equity_sold: number;

  @Column()
  valuation: number;

  @OneToMany("Equity", "startup")
  investments: Equity;

}

export const StartupSchema = Type.Object({
  id: Type.String(),
  name: Type.String(),
  icon: Type.String(),
  equity_sold: Type.Number(),
  valuation: Type.Number()
})

export type StartupType = Static<typeof StartupSchema>
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, RelationId } from "typeorm";
import { Startup, StartupSchema } from "./Startup";
import { User, UserSchema } from "./User";
import { Type, Static } from "@sinclair/typebox";

@Entity()
export class Equity {
    
    @PrimaryGeneratedColumn()
    id: number;

    @Column({default: 0})
    amount: number;

    @Column('double precision', {default: 0})
    equity: number;

    @CreateDateColumn()
    createdAt: Date;

    @ManyToOne(() => User, user => user.investments)
    @JoinColumn({ name: "user_id" })
    user: User;

    @RelationId((equity: Equity) => equity.user)
    userId: number;

    @ManyToOne(() => Startup, startup => startup.investments)
    @JoinColumn({ name: "startup_id" })
    startup: Startup;

    @RelationId((equity: Equity) => equity.startup)
    startupId: number;
}

export const EquitySchema = Type.Object({
    id: Type.Number(),
    userId: Type.Number(),
    startupId: Type.Number(),
    amount: Type.Number(),
    equity: Type.Number(),
    createdAt: Type.String({ format: "date-time" })
})

export type InvestmentType = Static<typeof EquitySchema>
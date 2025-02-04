import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, RelationId } from "typeorm";
import { Startup } from "./Startup.js";
import { User } from "./User.js";
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

    @ManyToOne("User", "investments", { onDelete: 'CASCADE' })
    @JoinColumn({ name: "user_id" })
    user: User;

    // @RelationId((equity: Equity) => equity.user)
    // userId: number;

    @Column()
    user_id: number;

    @ManyToOne("Startup", "investments", { onDelete: 'CASCADE' })
    @JoinColumn({ name: "startup_id" })
    startup: Startup;

    // @RelationId((equity: Equity) => equity.startup)
    // startupId: number;

    @Column()
    startup_id: number;
}

export const EquitySchema = Type.Object({
    id: Type.Number(),
    user_id: Type.Number(),
    startup_id: Type.Number(),
    amount: Type.Number(),
    equity: Type.Number(),
    createdAt: Type.String({ format: "date-time" })
})

export type InvestmentType = Static<typeof EquitySchema>
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, RelationId } from "typeorm";
import { Startup, StartupSchema } from "./Startup";
import { User, UserSchema } from "./User";
import { Type, Static } from "@sinclair/typebox";

@Entity()
export class Investment {
    
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    amount: number;

    @CreateDateColumn()
    createdAt: Date;

    @ManyToOne(() => User, user => user.investments)
    @JoinColumn({ name: "user_id" })
    user: Promise<User>;

    @RelationId((investment: Investment) => investment.user)
    userId: number;

    @ManyToOne(() => Startup, startup => startup.investments)
    @JoinColumn({ name: "startup_id" })
    startup: Promise<Startup>;

    @RelationId((investment: Investment) => investment.startup)
    startupId: number;
}

export const InvestmentSchema = Type.Object({
    id: Type.Number(),
    userId: Type.Number(),
    startupId: Type.Number(),
    amount: Type.Number(),
    createdAt: Type.String({ format: "date-time" })
})

export type InvestmentType = Static<typeof InvestmentSchema>
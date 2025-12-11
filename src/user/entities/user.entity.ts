import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    fam: string;

    @Column()
    class_name: string;

    @Column({default: ""})
    photo: string;

    @Column()
    birth_day: Date;

    @Column()
    user_type: string;

    @Column()
    tel: string;

    @Column({ default: ""})
    login: string;

    @Column({ default: ""})
    parol: string;

    @CreateDateColumn()
    created: Date;

    @UpdateDateColumn()
    updated: Date;
}

import { Yuqlama } from "src/yuqlama/entities/yuqlama.entity";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

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

    @OneToMany(()=> Yuqlama, (yuqlama)=> yuqlama.user)
    yuqlamalar: Yuqlama[]


    @CreateDateColumn()
    created: Date;

    @UpdateDateColumn()
    updated: Date;
}

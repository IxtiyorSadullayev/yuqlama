import { Yuqlama } from "src/yuqlama/entities/yuqlama.entity";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class User {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    fam: string;

    @Column()
    class_name: string;

    @Column({ default: "" })
    photo: string;

    @Column({})
    birth_day: Date;

    @Column()
    user_type: string;

    @Column({ default: "" })
    tel: string;

    @Column()
    jinsi: string;

    @Column({ default: "" })
    login: string;

    @Column({ default: "" })
    parol: string;

    @Column({ default: "" })
    pas_seria: string;

    @Column({ default: '' })
    pas_number: string;

    @OneToMany(() => Yuqlama, (yuqlama) => yuqlama.user)
    yuqlamalar: Yuqlama[]

    @CreateDateColumn({
        type: 'date',
        default: new Date().toISOString()
    })
    created: Date;

    @UpdateDateColumn({
        type: 'date',
        default: new Date().toISOString()
    })
    updated: Date;
}

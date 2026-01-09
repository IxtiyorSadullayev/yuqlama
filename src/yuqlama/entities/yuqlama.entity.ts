import { User } from "src/user/entities/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Yuqlama {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(()=> User, (user)=> user.yuqlamalar)
    user: User; 

    @Column()
    come: Date;

    @CreateDateColumn()
    created: Date;

    @UpdateDateColumn()
    updated: Date;
    
}

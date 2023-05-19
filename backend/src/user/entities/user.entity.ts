import { Post } from '../../posts/entities';
import { Like } from '../../votes/entities';
import { Comment } from '../../comments/entities';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', { unique: true })
  email: string;

  @Column('text')
  firstName: string;

  @Column('text')
  lastName: string;

  @Column('text', { unique: true })
  username: string;

  @Column('text', { nullable: true })
  password: string;

  @Column('text')
  avatar: string;

  @Column('text', {
    array: true,
    default: ['user'],
  })
  roles: string[];

  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];

  @OneToMany(() => Comment, (comment) => comment.user, {
    cascade: true,
    eager: true,
    nullable: true,
  })
  comments: Comment[];

  @OneToMany(() => Like, (like) => like.user, {
    cascade: true,
    eager: true,
    nullable: false,
  })
  likes: Like[];

  @Column({
    name: 'reset_password_token',
    nullable: true,
    type: 'uuid',
    unique: true,
  })
  resetPasswordToken: string;

  // @BeforeInsert()
  // checkUserFieldsBeforeInsert() {
  //   this.email = this.email.toLowerCase().trim();
  //   this.username = this.username
  //     .toLowerCase()
  //     .trim()
  //     .replaceAll(/[^\w\s]/gi, '');
  // }

  // @BeforeUpdate()
  // checkUserFieldsBeforeUpdate() {
  //   this.checkUserFieldsBeforeInsert();
  // }
}

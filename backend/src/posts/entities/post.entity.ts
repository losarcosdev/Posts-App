import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  BeforeInsert,
  ManyToOne,
  BeforeUpdate,
} from 'typeorm';
import { User } from '../../user/entities';
import { createSlug } from '../../helpers';
import { Like } from '../../votes/entities';
import { Comment } from '../../comments/entities';

@Entity({ name: 'posts' })
export class Post {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  title: string;

  @Column('text', {
    unique: true,
  })
  slug: string;

  @Column('text')
  description: string;

  @Column('text')
  tag: string;

  @OneToMany(() => Like, (like) => like.post, {
    cascade: true,
    eager: true,
    onDelete: 'CASCADE',
  })
  likes: Like[];

  @Column('int', { default: 0 })
  likeCount: number;

  @ManyToOne(() => User, (user) => user.posts, { eager: true })
  user: User;

  @OneToMany(() => Comment, (comment) => comment.post, {
    cascade: true,
    eager: true,
    nullable: true,
    onDelete: 'CASCADE',
  })
  comments: Comment[];

  // @BeforeInsert()
  // checkSlugInsert() {
  //   if (!this.slug) {
  //     this.slug = createSlug(this.title);
  //   }
  //   this.slug = createSlug(this.slug);
  // }

  // @BeforeUpdate()
  // checkSlugUpdate() {
  //   this.slug = createSlug(this.slug);
  //   this.slug = createSlug(this.title);
  // }
}

import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  Column,
} from 'typeorm';
import { Post } from '../../posts/entities';
import { User } from '../../user/entities';

@Entity({ name: 'comments' })
export class Comment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  parentId: string;

  @ManyToOne((type) => Comment, (comment) => comment.responses, {
    onDelete: 'CASCADE',
  })
  parent: Comment;

  @OneToMany((type) => Comment, (comment) => comment.parent)
  responses: Comment[];

  @Column('text')
  content: string;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  date: Date;

  @ManyToOne((type) => Post, (post) => post.comments, {
    onDelete: 'CASCADE',
  })
  post: Post;

  @ManyToOne((type) => User, (user) => user.comments, {
    onDelete: 'CASCADE',
  })
  user: User;
}

import { Post } from 'src/posts/entities';
import { User } from 'src/user/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

@Entity({ name: 'like' })
export class Like {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne((type) => User, (user) => user.likes, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne((type) => Post, (post) => post.likes)
  post: Post;
}

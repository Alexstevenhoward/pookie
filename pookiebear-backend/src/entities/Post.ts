import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from './User';
import { Dog } from './Dog';
import { Comment } from './Comment';
import { Like } from './Like';

export enum PostType {
  TEXT = 'text',
  PHOTO = 'photo',
  VIDEO = 'video',
  ACHIEVEMENT = 'achievement',
  MILESTONE = 'milestone',
}

export enum PostVisibility {
  PUBLIC = 'public',
  FRIENDS = 'friends',
  GROUP = 'group',
  PRIVATE = 'private',
}

export enum PostSource {
  APP = 'app',
  FACEBOOK = 'facebook',
}

@Entity('posts')
export class Post {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  authorId: string;

  @ManyToOne(() => User, (user) => user.posts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'authorId' })
  author: User;

  @Column({ type: 'uuid', nullable: true })
  dogId: string;

  @ManyToOne(() => Dog, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'dogId' })
  dog: Dog;

  @Column({ type: 'uuid', nullable: true })
  groupId: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'simple-array', nullable: true })
  mediaUrls: string[];

  @Column({ type: 'enum', enum: PostType })
  postType: PostType;

  @Column({ type: 'enum', enum: PostSource, default: PostSource.APP })
  source: PostSource;

  @Column({ type: 'varchar', nullable: true })
  facebookPostId: string;

  @Column({ type: 'enum', enum: PostVisibility, default: PostVisibility.PUBLIC })
  visibility: PostVisibility;

  @Column({ type: 'int', default: 0 })
  likeCount: number;

  @Column({ type: 'int', default: 0 })
  commentCount: number;

  @Column({ type: 'int', default: 0 })
  shareCount: number;

  @Column({ type: 'boolean', default: false })
  deleted: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  editedAt: Date;

  @OneToMany(() => Comment, (comment) => comment.post)
  comments: Comment[];

  @OneToMany(() => Like, (like) => like.post)
  likes: Like[];
}
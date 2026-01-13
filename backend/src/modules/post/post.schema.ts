import * as Joi from 'joi';

export const createPostSchema = Joi.object({
  title: Joi.string().required().min(1).max(200).messages({
    'string.empty': '제목을 입력해주세요',
    'string.max': '제목은 200자 이내로 입력해주세요',
  }),
  content: Joi.string().required().min(1).messages({
    'string.empty': '내용을 입력해주세요',
  }),
  category: Joi.string().valid('dev', 'diary').required().messages({
    'any.only': '카테고리는 dev 또는 diary만 가능합니다',
  }),
  isPrivate: Joi.boolean().default(false),
  tagIds: Joi.array().items(Joi.string().uuid()).default([]),
});

export const updatePostSchema = Joi.object({
  title: Joi.string().min(1).max(200).messages({
    'string.empty': '제목을 입력해주세요',
    'string.max': '제목은 200자 이내로 입력해주세요',
  }),
  content: Joi.string().min(1).messages({
    'string.empty': '내용을 입력해주세요',
  }),
  category: Joi.string().valid('dev', 'diary').messages({
    'any.only': '카테고리는 dev 또는 diary만 가능합니다',
  }),
  isPrivate: Joi.boolean(),
  tagIds: Joi.array().items(Joi.string().uuid()),
}).min(1);

export const postIdSchema = Joi.object({
  id: Joi.string().uuid().required().messages({
    'string.guid': '유효하지 않은 포스트 ID입니다',
  }),
});

export interface CreatePostDto {
  title: string;
  content: string;
  category: 'dev' | 'diary';
  isPrivate?: boolean;
  tagIds?: string[];
}

export interface UpdatePostDto {
  title?: string;
  content?: string;
  category?: 'dev' | 'diary';
  isPrivate?: boolean;
  tagIds?: string[];
}

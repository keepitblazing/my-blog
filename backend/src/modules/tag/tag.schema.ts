import * as Joi from 'joi';

export const createTagSchema = Joi.object({
  name: Joi.string().required().min(1).max(50).messages({
    'string.empty': '태그 이름을 입력해주세요',
    'string.max': '태그 이름은 50자 이내로 입력해주세요',
  }),
  slug: Joi.string()
    .required()
    .min(1)
    .max(50)
    .pattern(/^[a-z0-9-]+$/)
    .messages({
      'string.empty': '슬러그를 입력해주세요',
      'string.pattern.base': '슬러그는 영문 소문자, 숫자, 하이픈만 가능합니다',
    }),
});

export const updateTagSchema = Joi.object({
  name: Joi.string().min(1).max(50).messages({
    'string.empty': '태그 이름을 입력해주세요',
    'string.max': '태그 이름은 50자 이내로 입력해주세요',
  }),
  slug: Joi.string()
    .min(1)
    .max(50)
    .pattern(/^[a-z0-9-]+$/)
    .messages({
      'string.pattern.base': '슬러그는 영문 소문자, 숫자, 하이픈만 가능합니다',
    }),
}).min(1);

export const tagIdSchema = Joi.object({
  id: Joi.string().uuid().required(),
});

export const tagSlugSchema = Joi.object({
  slug: Joi.string().required(),
});

export interface CreateTagDto {
  name: string;
  slug: string;
}

export interface UpdateTagDto {
  name?: string;
  slug?: string;
}

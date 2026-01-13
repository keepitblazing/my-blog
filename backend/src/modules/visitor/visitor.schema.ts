import * as Joi from 'joi';

export const createVisitorLogSchema = Joi.object({
  visitorHash: Joi.string().required(),
  sessionId: Joi.string().required(),
  cookieId: Joi.string().required(),
  ipAddress: Joi.string().required(),
  userAgent: Joi.string().required(),
  pagePath: Joi.string().required(),
  isNewVisitor: Joi.boolean().default(true),
});

export interface CreateVisitorLogDto {
  visitorHash: string;
  sessionId: string;
  cookieId: string;
  ipAddress: string;
  userAgent: string;
  pagePath: string;
  isNewVisitor?: boolean;
}

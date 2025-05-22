import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { QuestionDetails } from "@/domain/forum/enterprise/entities/value-objects/question-details";
import { Slug } from "@/domain/forum/enterprise/entities/value-objects/slug";

import {
  Question as PrismaQuestion,
  User as PrismaUser,
  Attachment as PrismaAttachment,
  Prisma,
} from "@prisma/client";
import { PrismaAttachmentMapper } from "./prisma-attachments-mapper";

type PrismaQuestionDetails = PrismaQuestion & {
  author: PrismaUser;
  attachments: PrismaAttachment[];
};

export class PrismaQuestionDetailsMapper {
  static toDomain(raw: PrismaQuestionDetails): QuestionDetails {
    return QuestionDetails.create({
      questionId: new UniqueEntityID(raw.id),
      title: raw.title,
      slug: Slug.create(raw.slug),
      content: raw.content,
      bestAnswerId: raw.bestAnswerId
        ? new UniqueEntityID(raw.bestAnswerId)
        : null,
      attachments: raw.attachments.map(PrismaAttachmentMapper.toDomain),
      authorName: raw.author.name,
      authorId: new UniqueEntityID(raw.authorId),
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    });
  }
}

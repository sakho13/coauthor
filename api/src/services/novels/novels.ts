import type {
  QueryResolvers,
  MutationResolvers,
  NovelRelationResolvers,
} from 'types/graphql'

import { db } from 'src/lib/db'

export const novels: QueryResolvers['novels'] = () => {
  return db.novel.findMany({
    where: { authorId: context.currentUser.id },
  })
}

export const novel: QueryResolvers['novel'] = ({ novelId }) => {
  return db.novel.findUnique({
    where: { novelId, authorId: context.currentUser.id },
  })
}

export const createNovel: MutationResolvers['createNovel'] = ({ input }) => {
  return db.novel.create({
    data: {
      ...input,
      authorId: context.currentUser.id,
    },
  })
}

export const updateNovel: MutationResolvers['updateNovel'] = ({
  novelId,
  input,
}) => {
  return db.novel.update({
    data: {
      ...input,
      authorId: context.currentUser.id,
    },
    where: { novelId },
  })
}

export const deleteNovel: MutationResolvers['deleteNovel'] = ({ novelId }) => {
  return db.novel.delete({
    where: { novelId, authorId: context.currentUser.id },
  })
}

export const Novel: NovelRelationResolvers = {
  author: (_obj, { root }) => {
    return db.novel
      .findUnique({
        where: { novelId: root?.novelId, authorId: context.currentUser.id },
      })
      .author()
  },
}

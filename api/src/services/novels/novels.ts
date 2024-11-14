import type { QueryResolvers, MutationResolvers } from 'types/graphql'

import { db } from 'src/lib/db'

export const novels: QueryResolvers['novels'] = () => {
  return db.novel.findMany()
}

export const novel: QueryResolvers['novel'] = ({ novelId }) => {
  return db.novel.findUnique({
    where: { novelId },
  })
}

export const createNovel: MutationResolvers['createNovel'] = ({ input }) => {
  return db.novel.create({
    data: input,
  })
}

export const updateNovel: MutationResolvers['updateNovel'] = ({
  novelId,
  input,
}) => {
  return db.novel.update({
    data: input,
    where: { novelId },
  })
}

export const deleteNovel: MutationResolvers['deleteNovel'] = ({ novelId }) => {
  return db.novel.delete({
    where: { novelId },
  })
}

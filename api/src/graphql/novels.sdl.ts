export const schema = gql`
  type Novel {
    novelId: String!
    title: String!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type Query {
    novels: [Novel!]! @requireAuth
    novel(novelId: String!): Novel @requireAuth
  }

  input CreateNovelInput {
    title: String!
  }

  input UpdateNovelInput {
    title: String
  }

  type Mutation {
    createNovel(input: CreateNovelInput!): Novel! @requireAuth
    updateNovel(novelId: String!, input: UpdateNovelInput!): Novel! @requireAuth
    deleteNovel(novelId: String!): Novel! @requireAuth
  }
`

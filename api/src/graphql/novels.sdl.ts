export const schema = gql`
  type Novel {
    novelId: String!
    title: String!
    description: String!
    share: BigInt
    type: BigInt
    status: BigInt
    createdAt: DateTime!
    updatedAt: DateTime!
    authorId: String!
  }

  type Query {
    novels: [Novel!]! @requireAuth
    novel(novelId: String!): Novel @requireAuth
  }

  input CreateNovelInput {
    title: String!
    description: String!
    share: BigInt
    type: BigInt
    status: BigInt
  }

  input UpdateNovelInput {
    title: String
    description: String
    share: BigInt
    type: BigInt
    status: BigInt
  }

  type Mutation {
    createNovel(input: CreateNovelInput!): Novel! @requireAuth
    updateNovel(novelId: String!, input: UpdateNovelInput!): Novel! @requireAuth
    deleteNovel(novelId: String!): Novel! @requireAuth
  }
`

export const schema = gql`
  type Novel {
    novelId: String!
    authorId: String!
    title: String!
    description: String!
    share: Int!
    type: Int!
    status: Int!
    createdAt: DateTime!
    updatedAt: DateTime!
    author: User!
  }

  type Query {
    novels: [Novel!]! @requireAuth
    novel(novelId: String!): Novel @requireAuth
  }

  input CreateNovelInput {
    authorId: String!
    title: String!
    description: String!
    share: Int!
    type: Int!
    status: Int!
  }

  input UpdateNovelInput {
    authorId: String
    title: String
    description: String
    share: Int
    type: Int
    status: Int
  }

  type Mutation {
    createNovel(input: CreateNovelInput!): Novel! @requireAuth
    updateNovel(novelId: String!, input: UpdateNovelInput!): Novel! @requireAuth
    deleteNovel(novelId: String!): Novel! @requireAuth
  }
`

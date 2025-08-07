import { createSchema } from 'graphql-yoga';
import { Link, Comment } from '@prisma/client';
import { GraphQLContext } from './context';

const typeDefinitions = /* GraphQL */ `
	type Query {
		info: String!
		feed: [Link!]!
		comment(id: ID!): Comment
		link(id: ID!): Link
	}
	type Mutation {
		postLink(url: String!, description: String!): Link!
		postCommentOnLink(linkId: ID!, body: String!): Comment!
	}
	type Link {
		id: ID!
		description: String!
		url: String!
		comments: [Comment!]!
	}
	type Comment {
		id: ID!
		body: String!
		createdAt: String!
		link: Link!
	}
`;

const resolvers = {
	Query: {
		info: () => `This is an API for HackerNews clone`,
		feed: async (root: unknown, args: {}, context: GraphQLContext) => {
			return await context.prisma.link.findMany();
		},
		async link(
			root: unknown,
			args: { id: string },
			context: GraphQLContext
		) {
			return await context.prisma.link.findUnique({
				where: { id: parseInt(args.id) }
			});
		},
		async comment(
			parent: unknown,
			args: { id: string },
			context: GraphQLContext
		) {
			return context.prisma.comment.findUnique({
				where: { id: parseInt(args.id) },
				select: {
					id: true,
					body: true,
					createdAt: true,
					link: true
				}
			});
		}
	},
	Mutation: {
		async postLink(
			parent: unknown,
			args: { description: string; url: string },
			context: GraphQLContext
		) {
			const link: Link = await context.prisma.link.create({
				data: { description: args.description, url: args.url }
			});
			return link;
		},
		async postCommentOnLink(
			parent: unknown,
			args: { linkId: string; body: string },
			context: GraphQLContext
		) {
			const comment = await context.prisma.comment.create({
				data: {
					linkId: parseInt(args.linkId),
					body: args.body
				}
			});
			return comment;
		}
	},
	Link: {
		id: (parent: Link) => parent.id,
		description: (parent: Link) => parent.description,
		url: (parent: Link) => parent.url,
		comments: (parent: Link, args: {}, context: GraphQLContext) => {
			return context.prisma.comment.findMany({
				orderBy: { createdAt: 'desc' },
				where: { linkId: parent.id }
			});
		}
	},
	Comment: {
		id: (parent: Comment) => parent.id,
		body: (parent: Comment) => parent.body,
		createdAt: (parent: Comment) => parent.createdAt,
		// link: async (parent: Comment, args: {}, context: GraphQLContext) => {
		// 	return await context.prisma.link.findUnique({
		// 		where: {
		// 			id: parent.linkId
		// 		}
		// 	});
		// }
	}
};

export const schema = createSchema({
	resolvers: [resolvers],
	typeDefs: [typeDefinitions]
});

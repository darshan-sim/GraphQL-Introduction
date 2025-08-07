import { createSchema } from 'graphql-yoga';
import { GraphQLError } from 'graphql';
import { Prisma } from '@prisma/client';
import { Link, Comment } from '@prisma/client';
import { GraphQLContext } from './context';

const parseIntSafe = (value: string): number | null => {
	if (/^(\d+)$/.test(value)) {
		return parseInt(value, 10);
	}
	return null;
};

const applyTakeConstraints = (params: {
	min: number;
	max: number;
	value: number;
}) => {
	if (params.value < params.min || params.value > params.max) {
		throw new GraphQLError(
			`'take' argument value '${params.value}' is outside the valid range of '${params.min}' to '${params.max}'.`
		);
	}
	return params.value;
};

const typeDefinitions = /* GraphQL */ `
	type Query {
		info: String!
		feed(filterNeedle: String, skip: Int, take: Int): [Link!]!
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
		feed: async (
			root: unknown,
			args: { filterNeedle?: string; take?: number; skip?: number },
			context: GraphQLContext
		) => {
			const where =
				args.filterNeedle ?
					{
						OR: [
							{ description: { contains: args.filterNeedle } },
							{ url: { contains: args.filterNeedle } }
						]
					}
				:	{};
			const take = applyTakeConstraints({
				min: 1,
				max: 50,
				value: args.take ?? 30
			});
			return await context.prisma.link.findMany({
				where,
				skip: args.skip,
				take
			});
		},
		async link(
			root: unknown,
			args: { id: string },
			context: GraphQLContext
		) {
			const id = parseIntSafe(args.id);
			if (id === null) {
				return Promise.reject(
					new GraphQLError(
						`Cannot post comment on non-existing link with id '${args.id}'.`
					)
				);
			}
			return await context.prisma.link.findUnique({
				where: { id }
			});
		},
		async comment(
			parent: unknown,
			args: { id: string },
			context: GraphQLContext
		) {
			const id = parseIntSafe(args.id);
			if (id === null) {
				return Promise.reject(
					new GraphQLError(
						`Cannot post comment on non-existing link with id '${args.id}'.`
					)
				);
			}
			return context.prisma.comment.findUnique({
				where: { id },
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
			const linkId = parseIntSafe(args.linkId);
			if (linkId === null) {
				return Promise.reject(
					new GraphQLError(
						`Cannot post comment on non-existing link with id '${args.linkId}'.`
					)
				);
			}
			const newComment = await context.prisma.comment
				.create({
					data: {
						linkId,
						body: args.body
					}
				})
				.catch((error: unknown) => {
					if (
						error instanceof Prisma.PrismaClientKnownRequestError &&
						error.code === 'P2003'
					) {
						return Promise.reject(
							new GraphQLError(
								`Cannot post comment on non-existing link with id '${args.linkId}'.`
							)
						);
					}
					return Promise.reject(error);
				});
			return newComment;
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
		createdAt: (parent: Comment) => parent.createdAt
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

import { GraphQLError } from 'graphql';
import { parseIntSafe } from '../../../../schema';
import type { QueryResolvers } from './../../../types.generated';
export const link: NonNullable<QueryResolvers['link']> = async (
	_parent,
	args,
	context
) => {
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
};

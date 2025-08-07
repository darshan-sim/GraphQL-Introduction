import { applyTakeConstraints } from '../../../../schema';
import type { QueryResolvers } from './../../../types.generated';
export const feed: NonNullable<QueryResolvers['feed']> = async (
	_parent,
	args,
	context
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

	return context.prisma.link.findMany({
		where,
		skip: args.skip ?? 0,
		take
	});
};

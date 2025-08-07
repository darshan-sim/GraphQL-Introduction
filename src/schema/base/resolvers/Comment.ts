import type { CommentResolvers } from './../../types.generated';
export const Comment: CommentResolvers = {
	createdAt: ({ createdAt }, _arg, _ctx) => {
		return createdAt.toISOString();
	},
	link(parent, _arg, context) {
		return context.prisma.link.findUniqueOrThrow({
			where: {
				id: parent.linkId
			}
		});
	}
};

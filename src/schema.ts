import { createSchema } from 'graphql-yoga';
import { resolvers } from './schema/resolvers.generated';
import { typeDefs } from './schema/typeDefs.generated';
import { GraphQLError } from 'graphql';

export const schema = createSchema({
	resolvers: [resolvers],
	typeDefs: [typeDefs]
});

export const parseIntSafe = (value: string): number | null => {
	if (/^(\d+)$/.test(value)) {
		return parseInt(value, 10);
	}
	return null;
};

export const applyTakeConstraints = (params: {
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

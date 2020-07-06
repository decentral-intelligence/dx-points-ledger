import {CustomApolloContext} from '../../types/CustomApolloContext';

export const mutationResolver = {
    dropAll: async (_: any, __: any, {dataSources}: CustomApolloContext): Promise<any> => {
        await Promise.all([
            dataSources.accounts.drop(),
            dataSources.transactions.drop()
        ])
    }
}

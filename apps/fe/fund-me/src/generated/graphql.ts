import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type Investment = {
  __typename?: 'Investment';
  amount: Scalars['Int']['output'];
  id: Scalars['ID']['output'];
  projectId: Scalars['ID']['output'];
  userId: Scalars['ID']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createInvestment?: Maybe<Investment>;
  createProject?: Maybe<Project>;
  deleteProject?: Maybe<Project>;
  updateProject?: Maybe<Project>;
};


export type MutationCreateInvestmentArgs = {
  amount: Scalars['Int']['input'];
  projectId: Scalars['ID']['input'];
  userId: Scalars['ID']['input'];
};


export type MutationCreateProjectArgs = {
  allocation?: InputMaybe<Scalars['Int']['input']>;
  approved?: InputMaybe<Scalars['Boolean']['input']>;
  description: Scalars['String']['input'];
  endDate?: InputMaybe<Scalars['String']['input']>;
  imageUrl?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  startDate?: InputMaybe<Scalars['String']['input']>;
  type: Scalars['String']['input'];
};


export type MutationDeleteProjectArgs = {
  id: Scalars['ID']['input'];
};


export type MutationUpdateProjectArgs = {
  allocation?: InputMaybe<Scalars['Int']['input']>;
  approved?: InputMaybe<Scalars['Boolean']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  endDate?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  imageUrl?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  ownerId?: InputMaybe<Scalars['ID']['input']>;
  startDate?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
};

export type Project = {
  __typename?: 'Project';
  allocation: Scalars['Int']['output'];
  approved: Scalars['Boolean']['output'];
  description: Scalars['String']['output'];
  endDate?: Maybe<Scalars['String']['output']>;
  freeAllocation?: Maybe<Scalars['Int']['output']>;
  id: Scalars['ID']['output'];
  imageUrl?: Maybe<Scalars['String']['output']>;
  investments?: Maybe<Array<Maybe<Investment>>>;
  name: Scalars['String']['output'];
  ownerId: Scalars['ID']['output'];
  startDate?: Maybe<Scalars['String']['output']>;
  type: Scalars['String']['output'];
};

export type Query = {
  __typename?: 'Query';
  getAllProjects?: Maybe<Array<Maybe<Project>>>;
  getProject?: Maybe<Project>;
};


export type QueryGetProjectArgs = {
  id: Scalars['ID']['input'];
};

export type GetProjectQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetProjectQuery = { __typename?: 'Query', getProject?: { __typename?: 'Project', id: string, name: string, description: string, freeAllocation?: number | null, investments?: Array<{ __typename?: 'Investment', amount: number } | null> | null } | null };

export type GetAllProjectsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllProjectsQuery = { __typename?: 'Query', getAllProjects?: Array<{ __typename?: 'Project', id: string, name: string, freeAllocation?: number | null, description: string, allocation: number } | null> | null };

export type CreateInvestmentMutationVariables = Exact<{
  projectId: Scalars['ID']['input'];
  userId: Scalars['ID']['input'];
  amount: Scalars['Int']['input'];
}>;


export type CreateInvestmentMutation = { __typename?: 'Mutation', createInvestment?: { __typename?: 'Investment', id: string, amount: number } | null };

export type CreateProjectMutationVariables = Exact<{
  name: Scalars['String']['input'];
  description: Scalars['String']['input'];
  type: Scalars['String']['input'];
  imageUrl?: InputMaybe<Scalars['String']['input']>;
  allocation?: InputMaybe<Scalars['Int']['input']>;
  startDate?: InputMaybe<Scalars['String']['input']>;
  endDate?: InputMaybe<Scalars['String']['input']>;
  approved?: InputMaybe<Scalars['Boolean']['input']>;
}>;


export type CreateProjectMutation = { __typename?: 'Mutation', createProject?: { __typename?: 'Project', id: string, name: string, type: string, imageUrl?: string | null, description: string, allocation: number, startDate?: string | null, endDate?: string | null, ownerId: string, approved: boolean } | null };


export const GetProjectDocument = gql`
    query GetProject($id: ID!) {
  getProject(id: $id) {
    id
    name
    description
    freeAllocation
    investments {
      amount
    }
  }
}
    `;

/**
 * __useGetProjectQuery__
 *
 * To run a query within a React component, call `useGetProjectQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetProjectQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetProjectQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetProjectQuery(baseOptions: Apollo.QueryHookOptions<GetProjectQuery, GetProjectQueryVariables> & ({ variables: GetProjectQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetProjectQuery, GetProjectQueryVariables>(GetProjectDocument, options);
      }
export function useGetProjectLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetProjectQuery, GetProjectQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetProjectQuery, GetProjectQueryVariables>(GetProjectDocument, options);
        }
export function useGetProjectSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetProjectQuery, GetProjectQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetProjectQuery, GetProjectQueryVariables>(GetProjectDocument, options);
        }
export type GetProjectQueryHookResult = ReturnType<typeof useGetProjectQuery>;
export type GetProjectLazyQueryHookResult = ReturnType<typeof useGetProjectLazyQuery>;
export type GetProjectSuspenseQueryHookResult = ReturnType<typeof useGetProjectSuspenseQuery>;
export type GetProjectQueryResult = Apollo.QueryResult<GetProjectQuery, GetProjectQueryVariables>;
export const GetAllProjectsDocument = gql`
    query GetAllProjects {
  getAllProjects {
    id
    name
    freeAllocation
    description
    allocation
  }
}
    `;

/**
 * __useGetAllProjectsQuery__
 *
 * To run a query within a React component, call `useGetAllProjectsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAllProjectsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAllProjectsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetAllProjectsQuery(baseOptions?: Apollo.QueryHookOptions<GetAllProjectsQuery, GetAllProjectsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAllProjectsQuery, GetAllProjectsQueryVariables>(GetAllProjectsDocument, options);
      }
export function useGetAllProjectsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAllProjectsQuery, GetAllProjectsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAllProjectsQuery, GetAllProjectsQueryVariables>(GetAllProjectsDocument, options);
        }
export function useGetAllProjectsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetAllProjectsQuery, GetAllProjectsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetAllProjectsQuery, GetAllProjectsQueryVariables>(GetAllProjectsDocument, options);
        }
export type GetAllProjectsQueryHookResult = ReturnType<typeof useGetAllProjectsQuery>;
export type GetAllProjectsLazyQueryHookResult = ReturnType<typeof useGetAllProjectsLazyQuery>;
export type GetAllProjectsSuspenseQueryHookResult = ReturnType<typeof useGetAllProjectsSuspenseQuery>;
export type GetAllProjectsQueryResult = Apollo.QueryResult<GetAllProjectsQuery, GetAllProjectsQueryVariables>;
export const CreateInvestmentDocument = gql`
    mutation CreateInvestment($projectId: ID!, $userId: ID!, $amount: Int!) {
  createInvestment(projectId: $projectId, userId: $userId, amount: $amount) {
    id
    amount
  }
}
    `;
export type CreateInvestmentMutationFn = Apollo.MutationFunction<CreateInvestmentMutation, CreateInvestmentMutationVariables>;

/**
 * __useCreateInvestmentMutation__
 *
 * To run a mutation, you first call `useCreateInvestmentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateInvestmentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createInvestmentMutation, { data, loading, error }] = useCreateInvestmentMutation({
 *   variables: {
 *      projectId: // value for 'projectId'
 *      userId: // value for 'userId'
 *      amount: // value for 'amount'
 *   },
 * });
 */
export function useCreateInvestmentMutation(baseOptions?: Apollo.MutationHookOptions<CreateInvestmentMutation, CreateInvestmentMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateInvestmentMutation, CreateInvestmentMutationVariables>(CreateInvestmentDocument, options);
      }
export type CreateInvestmentMutationHookResult = ReturnType<typeof useCreateInvestmentMutation>;
export type CreateInvestmentMutationResult = Apollo.MutationResult<CreateInvestmentMutation>;
export type CreateInvestmentMutationOptions = Apollo.BaseMutationOptions<CreateInvestmentMutation, CreateInvestmentMutationVariables>;
export const CreateProjectDocument = gql`
    mutation CreateProject($name: String!, $description: String!, $type: String!, $imageUrl: String, $allocation: Int, $startDate: String, $endDate: String, $approved: Boolean) {
  createProject(
    name: $name
    description: $description
    type: $type
    imageUrl: $imageUrl
    allocation: $allocation
    startDate: $startDate
    endDate: $endDate
    approved: $approved
  ) {
    id
    name
    type
    imageUrl
    description
    allocation
    startDate
    endDate
    ownerId
    approved
  }
}
    `;
export type CreateProjectMutationFn = Apollo.MutationFunction<CreateProjectMutation, CreateProjectMutationVariables>;

/**
 * __useCreateProjectMutation__
 *
 * To run a mutation, you first call `useCreateProjectMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateProjectMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createProjectMutation, { data, loading, error }] = useCreateProjectMutation({
 *   variables: {
 *      name: // value for 'name'
 *      description: // value for 'description'
 *      type: // value for 'type'
 *      imageUrl: // value for 'imageUrl'
 *      allocation: // value for 'allocation'
 *      startDate: // value for 'startDate'
 *      endDate: // value for 'endDate'
 *      approved: // value for 'approved'
 *   },
 * });
 */
export function useCreateProjectMutation(baseOptions?: Apollo.MutationHookOptions<CreateProjectMutation, CreateProjectMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateProjectMutation, CreateProjectMutationVariables>(CreateProjectDocument, options);
      }
export type CreateProjectMutationHookResult = ReturnType<typeof useCreateProjectMutation>;
export type CreateProjectMutationResult = Apollo.MutationResult<CreateProjectMutation>;
export type CreateProjectMutationOptions = Apollo.BaseMutationOptions<CreateProjectMutation, CreateProjectMutationVariables>;
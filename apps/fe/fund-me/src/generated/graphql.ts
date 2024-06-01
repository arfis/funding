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
  DateTime: { input: any; output: any; }
};

export type Answer = {
  __typename?: 'Answer';
  description: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  isRight: Scalars['Boolean']['output'];
  quizQuestionId: Scalars['ID']['output'];
};

export type AnswerInput = {
  description: Scalars['String']['input'];
  isRight: Scalars['Boolean']['input'];
};

export type CreateProjectInput = {
  allocation: Scalars['Int']['input'];
  approved?: InputMaybe<Scalars['Boolean']['input']>;
  category?: InputMaybe<Scalars['String']['input']>;
  claim?: InputMaybe<Scalars['String']['input']>;
  dealDate?: InputMaybe<Scalars['String']['input']>;
  description: Scalars['String']['input'];
  endDate?: InputMaybe<Scalars['String']['input']>;
  ethAddress: Scalars['String']['input'];
  imageUrl?: InputMaybe<Scalars['String']['input']>;
  leadingInvestor?: InputMaybe<Scalars['String']['input']>;
  longDescription?: InputMaybe<Scalars['String']['input']>;
  maxInvestment?: InputMaybe<Scalars['Int']['input']>;
  minInvestment?: InputMaybe<Scalars['Int']['input']>;
  minInvestmentPrecision?: InputMaybe<Scalars['Int']['input']>;
  name: Scalars['String']['input'];
  overview?: InputMaybe<Scalars['String']['input']>;
  startDate?: InputMaybe<Scalars['String']['input']>;
  syndicateRaisingAmount?: InputMaybe<Scalars['String']['input']>;
  tge?: InputMaybe<Scalars['String']['input']>;
  tokenPrice?: InputMaybe<Scalars['String']['input']>;
  totalRaisingAmount?: InputMaybe<Scalars['String']['input']>;
  type: Scalars['String']['input'];
  valuation?: InputMaybe<Scalars['String']['input']>;
  vesting?: InputMaybe<Scalars['String']['input']>;
};

export type Investment = {
  __typename?: 'Investment';
  amount: Scalars['Int']['output'];
  createdAt: Scalars['DateTime']['output'];
  ethAddress: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  precision: Scalars['Int']['output'];
  projectId: Scalars['ID']['output'];
  status: Scalars['String']['output'];
  txHash: Scalars['String']['output'];
  userId: Scalars['ID']['output'];
  userName?: Maybe<Scalars['String']['output']>;
};

export enum InvestmentType {
  ClassicInvestment = 'CLASSIC_INVESTMENT',
  CryptoInvestment = 'CRYPTO_INVESTMENT',
  Unknown = 'UNKNOWN'
}

export type Mutation = {
  __typename?: 'Mutation';
  createInvestment: Investment;
  createProject?: Maybe<Project>;
  createQuiz?: Maybe<Quiz>;
  deleteProject?: Maybe<Project>;
  submitQuizAnswer?: Maybe<SubmitQuizResponse>;
  updateInvestmentStatus: Investment;
  updateProject?: Maybe<Project>;
  updateQuiz?: Maybe<Quiz>;
};


export type MutationCreateInvestmentArgs = {
  amount: Scalars['Int']['input'];
  ethAddress: Scalars['String']['input'];
  precision: Scalars['Int']['input'];
  projectId: Scalars['ID']['input'];
  status: Scalars['String']['input'];
  txHash?: InputMaybe<Scalars['String']['input']>;
};


export type MutationCreateProjectArgs = {
  input: CreateProjectInput;
};


export type MutationCreateQuizArgs = {
  input: QuizInput;
};


export type MutationDeleteProjectArgs = {
  id: Scalars['ID']['input'];
};


export type MutationSubmitQuizAnswerArgs = {
  input: SubmitQuizInput;
};


export type MutationUpdateInvestmentStatusArgs = {
  investmentId: Scalars['ID']['input'];
  status: Scalars['String']['input'];
  txHash?: InputMaybe<Scalars['String']['input']>;
};


export type MutationUpdateProjectArgs = {
  id: Scalars['ID']['input'];
  input: UpdateProjectInput;
};


export type MutationUpdateQuizArgs = {
  id: Scalars['ID']['input'];
  input: UpdateQuizInput;
};

export type Project = {
  __typename?: 'Project';
  allocation: Scalars['Int']['output'];
  approved: Scalars['Boolean']['output'];
  category?: Maybe<Scalars['String']['output']>;
  claim?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['String']['output'];
  dealDate?: Maybe<Scalars['String']['output']>;
  description: Scalars['String']['output'];
  endDate?: Maybe<Scalars['String']['output']>;
  ethAddress?: Maybe<Scalars['String']['output']>;
  freeAllocation?: Maybe<Scalars['Float']['output']>;
  hasPermissionToEdit: Scalars['Boolean']['output'];
  hasPermissionToInvest: Scalars['Boolean']['output'];
  id: Scalars['ID']['output'];
  imageUrl?: Maybe<Scalars['String']['output']>;
  invested?: Maybe<Array<Investment>>;
  investments?: Maybe<Array<Investment>>;
  leadingInvestor?: Maybe<Scalars['String']['output']>;
  longDescription?: Maybe<Scalars['String']['output']>;
  maxInvestment: Scalars['Int']['output'];
  minInvestment: Scalars['Int']['output'];
  minInvestmentPrecision: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  overview?: Maybe<Scalars['String']['output']>;
  ownerId: Scalars['ID']['output'];
  startDate: Scalars['String']['output'];
  syndicateRaisingAmount?: Maybe<Scalars['String']['output']>;
  tge?: Maybe<Scalars['String']['output']>;
  tokenPrice?: Maybe<Scalars['String']['output']>;
  totalRaisingAmount?: Maybe<Scalars['String']['output']>;
  type: InvestmentType;
  valuation?: Maybe<Scalars['String']['output']>;
  vesting?: Maybe<Scalars['String']['output']>;
};

export type Query = {
  __typename?: 'Query';
  getAllProjects?: Maybe<Array<Maybe<Project>>>;
  getAllQuizes?: Maybe<Array<Maybe<Quiz>>>;
  getProject?: Maybe<Project>;
  getProjectInvestments: Array<Investment>;
  getQuiz?: Maybe<Quiz>;
  getQuizByType?: Maybe<Quiz>;
};


export type QueryGetProjectArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetProjectInvestmentsArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetQuizArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetQuizByTypeArgs = {
  type: Scalars['String']['input'];
};

export type Quiz = {
  __typename?: 'Quiz';
  description: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  minimalPointsToSuccess: Scalars['Int']['output'];
  questions: Array<QuizQuestion>;
  type: InvestmentType;
};

export type QuizInput = {
  description: Scalars['String']['input'];
  minimalPointsToSuccess: Scalars['Int']['input'];
  questions: Array<QuizQuestionInput>;
  type: InvestmentType;
};

export type QuizQuestion = {
  __typename?: 'QuizQuestion';
  answerType: Scalars['String']['output'];
  answers: Array<Answer>;
  description: Scalars['String']['output'];
  id: Scalars['ID']['output'];
};

export type QuizQuestionInput = {
  answerType: Scalars['String']['input'];
  answers: Array<AnswerInput>;
  description: Scalars['String']['input'];
};

export type SubmitAnswerInput = {
  answerID: Scalars['ID']['input'];
  quizQuestionID: Scalars['ID']['input'];
};

export type SubmitQuizInput = {
  answers: Array<SubmitAnswerInput>;
  quizID: Scalars['ID']['input'];
};

export type SubmitQuizResponse = {
  __typename?: 'SubmitQuizResponse';
  pointsScored: Scalars['Int']['output'];
  success: Scalars['Boolean']['output'];
};

export type UpdateProjectInput = {
  allocation: Scalars['Int']['input'];
  approved?: InputMaybe<Scalars['Boolean']['input']>;
  category?: InputMaybe<Scalars['String']['input']>;
  claim?: InputMaybe<Scalars['String']['input']>;
  dealDate?: InputMaybe<Scalars['String']['input']>;
  description: Scalars['String']['input'];
  endDate?: InputMaybe<Scalars['String']['input']>;
  ethAddress: Scalars['String']['input'];
  imageUrl?: InputMaybe<Scalars['String']['input']>;
  leadingInvestor?: InputMaybe<Scalars['String']['input']>;
  longDescription?: InputMaybe<Scalars['String']['input']>;
  maxInvestment?: InputMaybe<Scalars['Int']['input']>;
  minInvestment?: InputMaybe<Scalars['Int']['input']>;
  minInvestmentPrecision?: InputMaybe<Scalars['Int']['input']>;
  name: Scalars['String']['input'];
  overview?: InputMaybe<Scalars['String']['input']>;
  startDate?: InputMaybe<Scalars['String']['input']>;
  syndicateRaisingAmount?: InputMaybe<Scalars['String']['input']>;
  tge?: InputMaybe<Scalars['String']['input']>;
  tokenPrice?: InputMaybe<Scalars['String']['input']>;
  totalRaisingAmount?: InputMaybe<Scalars['String']['input']>;
  type: Scalars['String']['input'];
  valuation?: InputMaybe<Scalars['String']['input']>;
  vesting?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateQuizInput = {
  description: Scalars['String']['input'];
  minimalPointsToSuccess: Scalars['Int']['input'];
  questions: Array<QuizQuestionInput>;
  type: Scalars['String']['input'];
};

export type GetProjectQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetProjectQuery = { __typename?: 'Query', getProject?: { __typename?: 'Project', id: string, name: string, type: InvestmentType, imageUrl?: string | null, description: string, allocation: number, ethAddress?: string | null, startDate: string, endDate?: string | null, ownerId: string, approved: boolean, maxInvestment: number, minInvestment: number, dealDate?: string | null, tokenPrice?: string | null, vesting?: string | null, totalRaisingAmount?: string | null, syndicateRaisingAmount?: string | null, leadingInvestor?: string | null, category?: string | null, valuation?: string | null, tge?: string | null, claim?: string | null, overview?: string | null, longDescription?: string | null, freeAllocation?: number | null, hasPermissionToEdit: boolean, hasPermissionToInvest: boolean, createdAt: string, invested?: Array<{ __typename?: 'Investment', createdAt: any, amount: number, precision: number, id: string, txHash: string, status: string }> | null, investments?: Array<{ __typename?: 'Investment', amount: number }> | null } | null };

export type GetProjectInvestmentsQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetProjectInvestmentsQuery = { __typename?: 'Query', getProjectInvestments: Array<{ __typename?: 'Investment', amount: number, userName?: string | null, status: string, createdAt: any, precision: number, id: string, txHash: string }> };

export type GetAllProjectsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllProjectsQuery = { __typename?: 'Query', getAllProjects?: Array<{ __typename?: 'Project', id: string, name: string, type: InvestmentType, imageUrl?: string | null, ethAddress?: string | null, description: string, allocation: number, startDate: string, category?: string | null, endDate?: string | null, ownerId: string, approved: boolean, maxInvestment: number, minInvestment: number, dealDate?: string | null, tokenPrice?: string | null, tge?: string | null, claim?: string | null, overview?: string | null, longDescription?: string | null, freeAllocation?: number | null, hasPermissionToEdit: boolean, hasPermissionToInvest: boolean, createdAt: string, investments?: Array<{ __typename?: 'Investment', id: string, projectId: string, userId: string, amount: number }> | null } | null> | null };

export type CreateInvestmentMutationVariables = Exact<{
  projectId: Scalars['ID']['input'];
  amount: Scalars['Int']['input'];
  ethAddress: Scalars['String']['input'];
  precision: Scalars['Int']['input'];
  status: Scalars['String']['input'];
  txHash: Scalars['String']['input'];
}>;


export type CreateInvestmentMutation = { __typename?: 'Mutation', createInvestment: { __typename?: 'Investment', id: string, amount: number } };

export type CreateProjectMutationVariables = Exact<{
  input: CreateProjectInput;
}>;


export type CreateProjectMutation = { __typename?: 'Mutation', createProject?: { __typename?: 'Project', id: string, name: string, type: InvestmentType, imageUrl?: string | null, description: string, allocation: number, startDate: string, endDate?: string | null, ownerId: string, approved: boolean, maxInvestment: number, minInvestment: number, minInvestmentPrecision: number } | null };

export type DeleteProjectMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteProjectMutation = { __typename?: 'Mutation', deleteProject?: { __typename?: 'Project', id: string } | null };

export type UpdateInvestmentStatusMutationVariables = Exact<{
  investmentId: Scalars['ID']['input'];
  status: Scalars['String']['input'];
  txHash: Scalars['String']['input'];
}>;


export type UpdateInvestmentStatusMutation = { __typename?: 'Mutation', updateInvestmentStatus: { __typename?: 'Investment', id: string, amount: number } };

export type UpdateProjectMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  input: UpdateProjectInput;
}>;


export type UpdateProjectMutation = { __typename?: 'Mutation', updateProject?: { __typename?: 'Project', id: string, name: string, type: InvestmentType, imageUrl?: string | null, description: string, allocation: number, startDate: string, endDate?: string | null, ownerId: string, approved: boolean, maxInvestment: number, minInvestment: number, minInvestmentPrecision: number } | null };

export type CreateQuizMutationVariables = Exact<{
  input: QuizInput;
}>;


export type CreateQuizMutation = { __typename?: 'Mutation', createQuiz?: { __typename?: 'Quiz', id: string, description: string, type: InvestmentType, minimalPointsToSuccess: number, questions: Array<{ __typename?: 'QuizQuestion', id: string, description: string, answerType: string, answers: Array<{ __typename?: 'Answer', id: string, description: string, isRight: boolean }> }> } | null };

export type GetQuizesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetQuizesQuery = { __typename?: 'Query', getAllQuizes?: Array<{ __typename?: 'Quiz', id: string, description: string, type: InvestmentType, minimalPointsToSuccess: number, questions: Array<{ __typename?: 'QuizQuestion', id: string, description: string, answerType: string, answers: Array<{ __typename?: 'Answer', description: string, isRight: boolean, quizQuestionId: string, id: string }> }> } | null> | null };

export type GetQuizQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetQuizQuery = { __typename?: 'Query', getQuiz?: { __typename?: 'Quiz', id: string, description: string, type: InvestmentType, questions: Array<{ __typename?: 'QuizQuestion', description: string, answerType: string, answers: Array<{ __typename?: 'Answer', description: string, id: string }> }> } | null };

export type GetQuizByTypeQueryVariables = Exact<{
  type: Scalars['String']['input'];
}>;


export type GetQuizByTypeQuery = { __typename?: 'Query', getQuizByType?: { __typename?: 'Quiz', id: string, description: string, type: InvestmentType, questions: Array<{ __typename?: 'QuizQuestion', id: string, description: string, answerType: string, answers: Array<{ __typename?: 'Answer', description: string, id: string }> }> } | null };

export type GetQuizTypesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetQuizTypesQuery = { __typename?: 'Query', getAllQuizes?: Array<{ __typename?: 'Quiz', type: InvestmentType } | null> | null };

export type SubmitQuizAnswerMutationVariables = Exact<{
  input: SubmitQuizInput;
}>;


export type SubmitQuizAnswerMutation = { __typename?: 'Mutation', submitQuizAnswer?: { __typename?: 'SubmitQuizResponse', success: boolean, pointsScored: number } | null };

export type UpdateQuizMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  input: UpdateQuizInput;
}>;


export type UpdateQuizMutation = { __typename?: 'Mutation', updateQuiz?: { __typename?: 'Quiz', id: string, description: string, type: InvestmentType, minimalPointsToSuccess: number, questions: Array<{ __typename?: 'QuizQuestion', id: string, description: string, answerType: string, answers: Array<{ __typename?: 'Answer', id: string, description: string, isRight: boolean }> }> } | null };


export const GetProjectDocument = gql`
    query GetProject($id: ID!) {
  getProject(id: $id) {
    id
    name
    type
    imageUrl
    description
    allocation
    ethAddress
    startDate
    endDate
    ownerId
    approved
    maxInvestment
    minInvestment
    dealDate
    tokenPrice
    vesting
    totalRaisingAmount
    syndicateRaisingAmount
    leadingInvestor
    category
    valuation
    tge
    claim
    overview
    longDescription
    freeAllocation
    hasPermissionToEdit
    hasPermissionToInvest
    invested {
      createdAt
      amount
      precision
      id
      txHash
      status
    }
    investments {
      amount
    }
    createdAt
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
export const GetProjectInvestmentsDocument = gql`
    query GetProjectInvestments($id: ID!) {
  getProjectInvestments(id: $id) {
    amount
    userName
    status
    createdAt
    precision
    id
    txHash
  }
}
    `;

/**
 * __useGetProjectInvestmentsQuery__
 *
 * To run a query within a React component, call `useGetProjectInvestmentsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetProjectInvestmentsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetProjectInvestmentsQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetProjectInvestmentsQuery(baseOptions: Apollo.QueryHookOptions<GetProjectInvestmentsQuery, GetProjectInvestmentsQueryVariables> & ({ variables: GetProjectInvestmentsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetProjectInvestmentsQuery, GetProjectInvestmentsQueryVariables>(GetProjectInvestmentsDocument, options);
      }
export function useGetProjectInvestmentsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetProjectInvestmentsQuery, GetProjectInvestmentsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetProjectInvestmentsQuery, GetProjectInvestmentsQueryVariables>(GetProjectInvestmentsDocument, options);
        }
export function useGetProjectInvestmentsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetProjectInvestmentsQuery, GetProjectInvestmentsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetProjectInvestmentsQuery, GetProjectInvestmentsQueryVariables>(GetProjectInvestmentsDocument, options);
        }
export type GetProjectInvestmentsQueryHookResult = ReturnType<typeof useGetProjectInvestmentsQuery>;
export type GetProjectInvestmentsLazyQueryHookResult = ReturnType<typeof useGetProjectInvestmentsLazyQuery>;
export type GetProjectInvestmentsSuspenseQueryHookResult = ReturnType<typeof useGetProjectInvestmentsSuspenseQuery>;
export type GetProjectInvestmentsQueryResult = Apollo.QueryResult<GetProjectInvestmentsQuery, GetProjectInvestmentsQueryVariables>;
export const GetAllProjectsDocument = gql`
    query GetAllProjects {
  getAllProjects {
    id
    name
    type
    imageUrl
    ethAddress
    description
    allocation
    startDate
    category
    endDate
    ownerId
    approved
    maxInvestment
    minInvestment
    dealDate
    tokenPrice
    tge
    claim
    overview
    longDescription
    freeAllocation
    hasPermissionToEdit
    hasPermissionToInvest
    investments {
      id
      projectId
      userId
      amount
    }
    createdAt
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
    mutation CreateInvestment($projectId: ID!, $amount: Int!, $ethAddress: String!, $precision: Int!, $status: String!, $txHash: String!) {
  createInvestment(
    projectId: $projectId
    amount: $amount
    ethAddress: $ethAddress
    precision: $precision
    status: $status
    txHash: $txHash
  ) {
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
 *      amount: // value for 'amount'
 *      ethAddress: // value for 'ethAddress'
 *      precision: // value for 'precision'
 *      status: // value for 'status'
 *      txHash: // value for 'txHash'
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
    mutation CreateProject($input: CreateProjectInput!) {
  createProject(input: $input) {
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
    maxInvestment
    minInvestment
    minInvestmentPrecision
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
 *      input: // value for 'input'
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
export const DeleteProjectDocument = gql`
    mutation DeleteProject($id: ID!) {
  deleteProject(id: $id) {
    id
  }
}
    `;
export type DeleteProjectMutationFn = Apollo.MutationFunction<DeleteProjectMutation, DeleteProjectMutationVariables>;

/**
 * __useDeleteProjectMutation__
 *
 * To run a mutation, you first call `useDeleteProjectMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteProjectMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteProjectMutation, { data, loading, error }] = useDeleteProjectMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteProjectMutation(baseOptions?: Apollo.MutationHookOptions<DeleteProjectMutation, DeleteProjectMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteProjectMutation, DeleteProjectMutationVariables>(DeleteProjectDocument, options);
      }
export type DeleteProjectMutationHookResult = ReturnType<typeof useDeleteProjectMutation>;
export type DeleteProjectMutationResult = Apollo.MutationResult<DeleteProjectMutation>;
export type DeleteProjectMutationOptions = Apollo.BaseMutationOptions<DeleteProjectMutation, DeleteProjectMutationVariables>;
export const UpdateInvestmentStatusDocument = gql`
    mutation UpdateInvestmentStatus($investmentId: ID!, $status: String!, $txHash: String!) {
  updateInvestmentStatus(
    investmentId: $investmentId
    status: $status
    txHash: $txHash
  ) {
    id
    amount
  }
}
    `;
export type UpdateInvestmentStatusMutationFn = Apollo.MutationFunction<UpdateInvestmentStatusMutation, UpdateInvestmentStatusMutationVariables>;

/**
 * __useUpdateInvestmentStatusMutation__
 *
 * To run a mutation, you first call `useUpdateInvestmentStatusMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateInvestmentStatusMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateInvestmentStatusMutation, { data, loading, error }] = useUpdateInvestmentStatusMutation({
 *   variables: {
 *      investmentId: // value for 'investmentId'
 *      status: // value for 'status'
 *      txHash: // value for 'txHash'
 *   },
 * });
 */
export function useUpdateInvestmentStatusMutation(baseOptions?: Apollo.MutationHookOptions<UpdateInvestmentStatusMutation, UpdateInvestmentStatusMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateInvestmentStatusMutation, UpdateInvestmentStatusMutationVariables>(UpdateInvestmentStatusDocument, options);
      }
export type UpdateInvestmentStatusMutationHookResult = ReturnType<typeof useUpdateInvestmentStatusMutation>;
export type UpdateInvestmentStatusMutationResult = Apollo.MutationResult<UpdateInvestmentStatusMutation>;
export type UpdateInvestmentStatusMutationOptions = Apollo.BaseMutationOptions<UpdateInvestmentStatusMutation, UpdateInvestmentStatusMutationVariables>;
export const UpdateProjectDocument = gql`
    mutation UpdateProject($id: ID!, $input: UpdateProjectInput!) {
  updateProject(id: $id, input: $input) {
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
    maxInvestment
    minInvestment
    minInvestmentPrecision
  }
}
    `;
export type UpdateProjectMutationFn = Apollo.MutationFunction<UpdateProjectMutation, UpdateProjectMutationVariables>;

/**
 * __useUpdateProjectMutation__
 *
 * To run a mutation, you first call `useUpdateProjectMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateProjectMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateProjectMutation, { data, loading, error }] = useUpdateProjectMutation({
 *   variables: {
 *      id: // value for 'id'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateProjectMutation(baseOptions?: Apollo.MutationHookOptions<UpdateProjectMutation, UpdateProjectMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateProjectMutation, UpdateProjectMutationVariables>(UpdateProjectDocument, options);
      }
export type UpdateProjectMutationHookResult = ReturnType<typeof useUpdateProjectMutation>;
export type UpdateProjectMutationResult = Apollo.MutationResult<UpdateProjectMutation>;
export type UpdateProjectMutationOptions = Apollo.BaseMutationOptions<UpdateProjectMutation, UpdateProjectMutationVariables>;
export const CreateQuizDocument = gql`
    mutation CreateQuiz($input: QuizInput!) {
  createQuiz(input: $input) {
    id
    description
    type
    minimalPointsToSuccess
    questions {
      id
      description
      answerType
      answers {
        id
        description
        isRight
      }
    }
  }
}
    `;
export type CreateQuizMutationFn = Apollo.MutationFunction<CreateQuizMutation, CreateQuizMutationVariables>;

/**
 * __useCreateQuizMutation__
 *
 * To run a mutation, you first call `useCreateQuizMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateQuizMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createQuizMutation, { data, loading, error }] = useCreateQuizMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateQuizMutation(baseOptions?: Apollo.MutationHookOptions<CreateQuizMutation, CreateQuizMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateQuizMutation, CreateQuizMutationVariables>(CreateQuizDocument, options);
      }
export type CreateQuizMutationHookResult = ReturnType<typeof useCreateQuizMutation>;
export type CreateQuizMutationResult = Apollo.MutationResult<CreateQuizMutation>;
export type CreateQuizMutationOptions = Apollo.BaseMutationOptions<CreateQuizMutation, CreateQuizMutationVariables>;
export const GetQuizesDocument = gql`
    query GetQuizes {
  getAllQuizes {
    id
    description
    type
    minimalPointsToSuccess
    questions {
      id
      description
      answerType
      answers {
        description
        isRight
        quizQuestionId
        id
      }
    }
  }
}
    `;

/**
 * __useGetQuizesQuery__
 *
 * To run a query within a React component, call `useGetQuizesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetQuizesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetQuizesQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetQuizesQuery(baseOptions?: Apollo.QueryHookOptions<GetQuizesQuery, GetQuizesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetQuizesQuery, GetQuizesQueryVariables>(GetQuizesDocument, options);
      }
export function useGetQuizesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetQuizesQuery, GetQuizesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetQuizesQuery, GetQuizesQueryVariables>(GetQuizesDocument, options);
        }
export function useGetQuizesSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetQuizesQuery, GetQuizesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetQuizesQuery, GetQuizesQueryVariables>(GetQuizesDocument, options);
        }
export type GetQuizesQueryHookResult = ReturnType<typeof useGetQuizesQuery>;
export type GetQuizesLazyQueryHookResult = ReturnType<typeof useGetQuizesLazyQuery>;
export type GetQuizesSuspenseQueryHookResult = ReturnType<typeof useGetQuizesSuspenseQuery>;
export type GetQuizesQueryResult = Apollo.QueryResult<GetQuizesQuery, GetQuizesQueryVariables>;
export const GetQuizDocument = gql`
    query GetQuiz($id: ID!) {
  getQuiz(id: $id) {
    id
    description
    type
    questions {
      description
      answerType
      answers {
        description
        id
      }
    }
  }
}
    `;

/**
 * __useGetQuizQuery__
 *
 * To run a query within a React component, call `useGetQuizQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetQuizQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetQuizQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetQuizQuery(baseOptions: Apollo.QueryHookOptions<GetQuizQuery, GetQuizQueryVariables> & ({ variables: GetQuizQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetQuizQuery, GetQuizQueryVariables>(GetQuizDocument, options);
      }
export function useGetQuizLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetQuizQuery, GetQuizQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetQuizQuery, GetQuizQueryVariables>(GetQuizDocument, options);
        }
export function useGetQuizSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetQuizQuery, GetQuizQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetQuizQuery, GetQuizQueryVariables>(GetQuizDocument, options);
        }
export type GetQuizQueryHookResult = ReturnType<typeof useGetQuizQuery>;
export type GetQuizLazyQueryHookResult = ReturnType<typeof useGetQuizLazyQuery>;
export type GetQuizSuspenseQueryHookResult = ReturnType<typeof useGetQuizSuspenseQuery>;
export type GetQuizQueryResult = Apollo.QueryResult<GetQuizQuery, GetQuizQueryVariables>;
export const GetQuizByTypeDocument = gql`
    query GetQuizByType($type: String!) {
  getQuizByType(type: $type) {
    id
    description
    type
    questions {
      id
      description
      answerType
      answers {
        description
        id
      }
    }
  }
}
    `;

/**
 * __useGetQuizByTypeQuery__
 *
 * To run a query within a React component, call `useGetQuizByTypeQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetQuizByTypeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetQuizByTypeQuery({
 *   variables: {
 *      type: // value for 'type'
 *   },
 * });
 */
export function useGetQuizByTypeQuery(baseOptions: Apollo.QueryHookOptions<GetQuizByTypeQuery, GetQuizByTypeQueryVariables> & ({ variables: GetQuizByTypeQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetQuizByTypeQuery, GetQuizByTypeQueryVariables>(GetQuizByTypeDocument, options);
      }
export function useGetQuizByTypeLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetQuizByTypeQuery, GetQuizByTypeQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetQuizByTypeQuery, GetQuizByTypeQueryVariables>(GetQuizByTypeDocument, options);
        }
export function useGetQuizByTypeSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetQuizByTypeQuery, GetQuizByTypeQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetQuizByTypeQuery, GetQuizByTypeQueryVariables>(GetQuizByTypeDocument, options);
        }
export type GetQuizByTypeQueryHookResult = ReturnType<typeof useGetQuizByTypeQuery>;
export type GetQuizByTypeLazyQueryHookResult = ReturnType<typeof useGetQuizByTypeLazyQuery>;
export type GetQuizByTypeSuspenseQueryHookResult = ReturnType<typeof useGetQuizByTypeSuspenseQuery>;
export type GetQuizByTypeQueryResult = Apollo.QueryResult<GetQuizByTypeQuery, GetQuizByTypeQueryVariables>;
export const GetQuizTypesDocument = gql`
    query GetQuizTypes {
  getAllQuizes {
    type
  }
}
    `;

/**
 * __useGetQuizTypesQuery__
 *
 * To run a query within a React component, call `useGetQuizTypesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetQuizTypesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetQuizTypesQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetQuizTypesQuery(baseOptions?: Apollo.QueryHookOptions<GetQuizTypesQuery, GetQuizTypesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetQuizTypesQuery, GetQuizTypesQueryVariables>(GetQuizTypesDocument, options);
      }
export function useGetQuizTypesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetQuizTypesQuery, GetQuizTypesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetQuizTypesQuery, GetQuizTypesQueryVariables>(GetQuizTypesDocument, options);
        }
export function useGetQuizTypesSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetQuizTypesQuery, GetQuizTypesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetQuizTypesQuery, GetQuizTypesQueryVariables>(GetQuizTypesDocument, options);
        }
export type GetQuizTypesQueryHookResult = ReturnType<typeof useGetQuizTypesQuery>;
export type GetQuizTypesLazyQueryHookResult = ReturnType<typeof useGetQuizTypesLazyQuery>;
export type GetQuizTypesSuspenseQueryHookResult = ReturnType<typeof useGetQuizTypesSuspenseQuery>;
export type GetQuizTypesQueryResult = Apollo.QueryResult<GetQuizTypesQuery, GetQuizTypesQueryVariables>;
export const SubmitQuizAnswerDocument = gql`
    mutation SubmitQuizAnswer($input: SubmitQuizInput!) {
  submitQuizAnswer(input: $input) {
    success
    pointsScored
  }
}
    `;
export type SubmitQuizAnswerMutationFn = Apollo.MutationFunction<SubmitQuizAnswerMutation, SubmitQuizAnswerMutationVariables>;

/**
 * __useSubmitQuizAnswerMutation__
 *
 * To run a mutation, you first call `useSubmitQuizAnswerMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSubmitQuizAnswerMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [submitQuizAnswerMutation, { data, loading, error }] = useSubmitQuizAnswerMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useSubmitQuizAnswerMutation(baseOptions?: Apollo.MutationHookOptions<SubmitQuizAnswerMutation, SubmitQuizAnswerMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SubmitQuizAnswerMutation, SubmitQuizAnswerMutationVariables>(SubmitQuizAnswerDocument, options);
      }
export type SubmitQuizAnswerMutationHookResult = ReturnType<typeof useSubmitQuizAnswerMutation>;
export type SubmitQuizAnswerMutationResult = Apollo.MutationResult<SubmitQuizAnswerMutation>;
export type SubmitQuizAnswerMutationOptions = Apollo.BaseMutationOptions<SubmitQuizAnswerMutation, SubmitQuizAnswerMutationVariables>;
export const UpdateQuizDocument = gql`
    mutation UpdateQuiz($id: ID!, $input: UpdateQuizInput!) {
  updateQuiz(id: $id, input: $input) {
    id
    description
    type
    minimalPointsToSuccess
    questions {
      id
      description
      answerType
      answers {
        id
        description
        isRight
      }
    }
  }
}
    `;
export type UpdateQuizMutationFn = Apollo.MutationFunction<UpdateQuizMutation, UpdateQuizMutationVariables>;

/**
 * __useUpdateQuizMutation__
 *
 * To run a mutation, you first call `useUpdateQuizMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateQuizMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateQuizMutation, { data, loading, error }] = useUpdateQuizMutation({
 *   variables: {
 *      id: // value for 'id'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateQuizMutation(baseOptions?: Apollo.MutationHookOptions<UpdateQuizMutation, UpdateQuizMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateQuizMutation, UpdateQuizMutationVariables>(UpdateQuizDocument, options);
      }
export type UpdateQuizMutationHookResult = ReturnType<typeof useUpdateQuizMutation>;
export type UpdateQuizMutationResult = Apollo.MutationResult<UpdateQuizMutation>;
export type UpdateQuizMutationOptions = Apollo.BaseMutationOptions<UpdateQuizMutation, UpdateQuizMutationVariables>;
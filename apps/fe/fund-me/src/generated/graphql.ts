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

export type Investment = {
  __typename?: 'Investment';
  amount: Scalars['Int']['output'];
  id: Scalars['ID']['output'];
  projectId: Scalars['ID']['output'];
  userId: Scalars['ID']['output'];
};

export enum InvestmentType {
  ClassicInvestment = 'CLASSIC_INVESTMENT',
  CryptoInvestment = 'CRYPTO_INVESTMENT',
  Unknown = 'UNKNOWN'
}

export type Mutation = {
  __typename?: 'Mutation';
  createInvestment?: Maybe<Investment>;
  createProject?: Maybe<Project>;
  createQuiz?: Maybe<Quiz>;
  deleteProject?: Maybe<Project>;
  submitQuizAnswer?: Maybe<SubmitQuizResponse>;
  updateProject?: Maybe<Project>;
  updateQuiz?: Maybe<Quiz>;
};


export type MutationCreateInvestmentArgs = {
  amount: Scalars['Int']['input'];
  projectId: Scalars['ID']['input'];
};


export type MutationCreateProjectArgs = {
  allocation?: InputMaybe<Scalars['Int']['input']>;
  approved?: InputMaybe<Scalars['Boolean']['input']>;
  description: Scalars['String']['input'];
  endDate?: InputMaybe<Scalars['String']['input']>;
  imageUrl?: InputMaybe<Scalars['String']['input']>;
  maxInvestment?: InputMaybe<Scalars['Int']['input']>;
  minInvestment?: InputMaybe<Scalars['Int']['input']>;
  name: Scalars['String']['input'];
  startDate?: InputMaybe<Scalars['String']['input']>;
  type: Scalars['String']['input'];
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
  description: Scalars['String']['output'];
  endDate: Scalars['String']['output'];
  freeAllocation?: Maybe<Scalars['Int']['output']>;
  hasPermissionToEdit: Scalars['Boolean']['output'];
  hasPermissionToInvest: Scalars['Boolean']['output'];
  id: Scalars['ID']['output'];
  imageUrl?: Maybe<Scalars['String']['output']>;
  investments?: Maybe<Array<Maybe<Investment>>>;
  maxInvestment: Scalars['Int']['output'];
  minInvestment: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  ownerId: Scalars['ID']['output'];
  startDate: Scalars['String']['output'];
  type: InvestmentType;
};

export type Query = {
  __typename?: 'Query';
  getAllProjects?: Maybe<Array<Maybe<Project>>>;
  getAllQuizes?: Maybe<Array<Maybe<Quiz>>>;
  getProject?: Maybe<Project>;
  getQuiz?: Maybe<Quiz>;
  getQuizByType?: Maybe<Quiz>;
};


export type QueryGetProjectArgs = {
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
  allocation?: InputMaybe<Scalars['Int']['input']>;
  approved?: InputMaybe<Scalars['Boolean']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  endDate?: InputMaybe<Scalars['String']['input']>;
  imageUrl?: InputMaybe<Scalars['String']['input']>;
  maxInvestment?: InputMaybe<Scalars['Int']['input']>;
  minInvestment?: InputMaybe<Scalars['Int']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  startDate?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
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


export type GetProjectQuery = { __typename?: 'Query', getProject?: { __typename?: 'Project', id: string, name: string, description: string, freeAllocation?: number | null, hasPermissionToEdit: boolean, hasPermissionToInvest: boolean, investments?: Array<{ __typename?: 'Investment', amount: number } | null> | null } | null };

export type GetAllProjectsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllProjectsQuery = { __typename?: 'Query', getAllProjects?: Array<{ __typename?: 'Project', id: string, hasPermissionToEdit: boolean, hasPermissionToInvest: boolean, name: string, type: InvestmentType, imageUrl?: string | null, description: string, allocation: number, startDate: string, endDate: string, ownerId: string, approved: boolean, maxInvestment: number, minInvestment: number, freeAllocation?: number | null, investments?: Array<{ __typename?: 'Investment', id: string, projectId: string, userId: string, amount: number } | null> | null } | null> | null };

export type CreateInvestmentMutationVariables = Exact<{
  projectId: Scalars['ID']['input'];
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
  minInvestment?: InputMaybe<Scalars['Int']['input']>;
  maxInvestment?: InputMaybe<Scalars['Int']['input']>;
}>;


export type CreateProjectMutation = { __typename?: 'Mutation', createProject?: { __typename?: 'Project', id: string, name: string, type: InvestmentType, imageUrl?: string | null, description: string, allocation: number, startDate: string, endDate: string, ownerId: string, approved: boolean, maxInvestment: number, minInvestment: number } | null };

export type UpdateProjectMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  input: UpdateProjectInput;
}>;


export type UpdateProjectMutation = { __typename?: 'Mutation', updateProject?: { __typename?: 'Project', id: string, name: string, type: InvestmentType, imageUrl?: string | null, description: string, allocation: number, startDate: string, endDate: string, ownerId: string, approved: boolean, maxInvestment: number, minInvestment: number } | null };

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
    description
    freeAllocation
    hasPermissionToEdit
    hasPermissionToInvest
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
    hasPermissionToEdit
    hasPermissionToInvest
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
    freeAllocation
    investments {
      id
      projectId
      userId
      amount
    }
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
    mutation CreateInvestment($projectId: ID!, $amount: Int!) {
  createInvestment(projectId: $projectId, amount: $amount) {
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
    mutation CreateProject($name: String!, $description: String!, $type: String!, $imageUrl: String, $allocation: Int, $startDate: String, $endDate: String, $approved: Boolean, $minInvestment: Int, $maxInvestment: Int) {
  createProject(
    name: $name
    description: $description
    type: $type
    imageUrl: $imageUrl
    allocation: $allocation
    startDate: $startDate
    endDate: $endDate
    approved: $approved
    minInvestment: $minInvestment
    maxInvestment: $maxInvestment
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
    maxInvestment
    minInvestment
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
 *      minInvestment: // value for 'minInvestment'
 *      maxInvestment: // value for 'maxInvestment'
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
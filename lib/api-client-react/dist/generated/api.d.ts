import type { QueryKey, UseMutationOptions, UseMutationResult, UseQueryOptions, UseQueryResult } from "@tanstack/react-query";
import type { AiAutofillStepBody, AiAutofillStepResponse, AiGenerateStepsBody, AiGenerateStepsResponse, AiPolishStepsBody, AiPolishStepsResponse, AnalyzeScreenshotsBody, AnalyzeScreenshotsResponse, ApiError, CreateGeminiConversationBody, CreateGuideBody, CreateGuideFormBody, CreateGuideSignatureBody, GeminiConversation, GeminiConversationWithMessages, GeminiError, GeminiMessage, GenerateGeminiImageBody, GenerateGeminiImageResponse, Guide, GuideForm, GuideFormSubmission, GuideSignature, GuideStats, HealthStatus, PublicGuideForm, SendGeminiMessageBody, SubmitGuideFormBody, UpdateGuideBody, UpdateGuideFormBody } from "./api.schemas";
import { customFetch } from "../custom-fetch";
import type { ErrorType, BodyType } from "../custom-fetch";
type AwaitedInput<T> = PromiseLike<T> | T;
type Awaited<O> = O extends AwaitedInput<infer T> ? T : never;
type SecondParameter<T extends (...args: never) => unknown> = Parameters<T>[1];
/**
 * Returns server health status
 * @summary Health check
 */
export declare const getHealthCheckUrl: () => string;
export declare const healthCheck: (options?: RequestInit) => Promise<HealthStatus>;
export declare const getHealthCheckQueryKey: () => readonly ["/api/healthz"];
export declare const getHealthCheckQueryOptions: <TData = Awaited<ReturnType<typeof healthCheck>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData> & {
    queryKey: QueryKey;
};
export type HealthCheckQueryResult = NonNullable<Awaited<ReturnType<typeof healthCheck>>>;
export type HealthCheckQueryError = ErrorType<unknown>;
/**
 * @summary Health check
 */
export declare function useHealthCheck<TData = Awaited<ReturnType<typeof healthCheck>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary List all guides
 */
export declare const getListGuidesUrl: () => string;
export declare const listGuides: (options?: RequestInit) => Promise<Guide[]>;
export declare const getListGuidesQueryKey: () => readonly ["/api/guides"];
export declare const getListGuidesQueryOptions: <TData = Awaited<ReturnType<typeof listGuides>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listGuides>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listGuides>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListGuidesQueryResult = NonNullable<Awaited<ReturnType<typeof listGuides>>>;
export type ListGuidesQueryError = ErrorType<unknown>;
/**
 * @summary List all guides
 */
export declare function useListGuides<TData = Awaited<ReturnType<typeof listGuides>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listGuides>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Create a new guide
 */
export declare const getCreateGuideUrl: () => string;
export declare const createGuide: (createGuideBody: CreateGuideBody, options?: RequestInit) => Promise<Guide>;
export declare const getCreateGuideMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createGuide>>, TError, {
        data: BodyType<CreateGuideBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof createGuide>>, TError, {
    data: BodyType<CreateGuideBody>;
}, TContext>;
export type CreateGuideMutationResult = NonNullable<Awaited<ReturnType<typeof createGuide>>>;
export type CreateGuideMutationBody = BodyType<CreateGuideBody>;
export type CreateGuideMutationError = ErrorType<unknown>;
/**
 * @summary Create a new guide
 */
export declare const useCreateGuide: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createGuide>>, TError, {
        data: BodyType<CreateGuideBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof createGuide>>, TError, {
    data: BodyType<CreateGuideBody>;
}, TContext>;
/**
 * @summary Get guide by ID
 */
export declare const getGetGuideUrl: (id: number) => string;
export declare const getGuide: (id: number, options?: RequestInit) => Promise<Guide>;
export declare const getGetGuideQueryKey: (id: number) => readonly [`/api/guides/${number}`];
export declare const getGetGuideQueryOptions: <TData = Awaited<ReturnType<typeof getGuide>>, TError = ErrorType<ApiError>>(id: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getGuide>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getGuide>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetGuideQueryResult = NonNullable<Awaited<ReturnType<typeof getGuide>>>;
export type GetGuideQueryError = ErrorType<ApiError>;
/**
 * @summary Get guide by ID
 */
export declare function useGetGuide<TData = Awaited<ReturnType<typeof getGuide>>, TError = ErrorType<ApiError>>(id: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getGuide>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Update a guide
 */
export declare const getUpdateGuideUrl: (id: number) => string;
export declare const updateGuide: (id: number, updateGuideBody: UpdateGuideBody, options?: RequestInit) => Promise<Guide>;
export declare const getUpdateGuideMutationOptions: <TError = ErrorType<ApiError>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateGuide>>, TError, {
        id: number;
        data: BodyType<UpdateGuideBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof updateGuide>>, TError, {
    id: number;
    data: BodyType<UpdateGuideBody>;
}, TContext>;
export type UpdateGuideMutationResult = NonNullable<Awaited<ReturnType<typeof updateGuide>>>;
export type UpdateGuideMutationBody = BodyType<UpdateGuideBody>;
export type UpdateGuideMutationError = ErrorType<ApiError>;
/**
 * @summary Update a guide
 */
export declare const useUpdateGuide: <TError = ErrorType<ApiError>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateGuide>>, TError, {
        id: number;
        data: BodyType<UpdateGuideBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof updateGuide>>, TError, {
    id: number;
    data: BodyType<UpdateGuideBody>;
}, TContext>;
/**
 * @summary Delete a guide
 */
export declare const getDeleteGuideUrl: (id: number) => string;
export declare const deleteGuide: (id: number, options?: RequestInit) => Promise<void>;
export declare const getDeleteGuideMutationOptions: <TError = ErrorType<ApiError>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteGuide>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof deleteGuide>>, TError, {
    id: number;
}, TContext>;
export type DeleteGuideMutationResult = NonNullable<Awaited<ReturnType<typeof deleteGuide>>>;
export type DeleteGuideMutationError = ErrorType<ApiError>;
/**
 * @summary Delete a guide
 */
export declare const useDeleteGuide: <TError = ErrorType<ApiError>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteGuide>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof deleteGuide>>, TError, {
    id: number;
}, TContext>;
/**
 * @summary Get summary stats for guides
 */
export declare const getGetGuideStatsUrl: () => string;
export declare const getGuideStats: (options?: RequestInit) => Promise<GuideStats>;
export declare const getGetGuideStatsQueryKey: () => readonly ["/api/guides/stats/summary"];
export declare const getGetGuideStatsQueryOptions: <TData = Awaited<ReturnType<typeof getGuideStats>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getGuideStats>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getGuideStats>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetGuideStatsQueryResult = NonNullable<Awaited<ReturnType<typeof getGuideStats>>>;
export type GetGuideStatsQueryError = ErrorType<unknown>;
/**
 * @summary Get summary stats for guides
 */
export declare function useGetGuideStats<TData = Awaited<ReturnType<typeof getGuideStats>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getGuideStats>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Use Gemini to generate steps from a rough outline
 */
export declare const getAiGenerateStepsUrl: () => string;
export declare const aiGenerateSteps: (aiGenerateStepsBody: AiGenerateStepsBody, options?: RequestInit) => Promise<AiGenerateStepsResponse>;
export declare const getAiGenerateStepsMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof aiGenerateSteps>>, TError, {
        data: BodyType<AiGenerateStepsBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof aiGenerateSteps>>, TError, {
    data: BodyType<AiGenerateStepsBody>;
}, TContext>;
export type AiGenerateStepsMutationResult = NonNullable<Awaited<ReturnType<typeof aiGenerateSteps>>>;
export type AiGenerateStepsMutationBody = BodyType<AiGenerateStepsBody>;
export type AiGenerateStepsMutationError = ErrorType<unknown>;
/**
 * @summary Use Gemini to generate steps from a rough outline
 */
export declare const useAiGenerateSteps: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof aiGenerateSteps>>, TError, {
        data: BodyType<AiGenerateStepsBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof aiGenerateSteps>>, TError, {
    data: BodyType<AiGenerateStepsBody>;
}, TContext>;
/**
 * @summary Use Gemini to polish and improve all steps in a guide
 */
export declare const getAiPolishStepsUrl: () => string;
export declare const aiPolishSteps: (aiPolishStepsBody: AiPolishStepsBody, options?: RequestInit) => Promise<AiPolishStepsResponse>;
export declare const getAiPolishStepsMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof aiPolishSteps>>, TError, {
        data: BodyType<AiPolishStepsBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof aiPolishSteps>>, TError, {
    data: BodyType<AiPolishStepsBody>;
}, TContext>;
export type AiPolishStepsMutationResult = NonNullable<Awaited<ReturnType<typeof aiPolishSteps>>>;
export type AiPolishStepsMutationBody = BodyType<AiPolishStepsBody>;
export type AiPolishStepsMutationError = ErrorType<unknown>;
/**
 * @summary Use Gemini to polish and improve all steps in a guide
 */
export declare const useAiPolishSteps: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof aiPolishSteps>>, TError, {
        data: BodyType<AiPolishStepsBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof aiPolishSteps>>, TError, {
    data: BodyType<AiPolishStepsBody>;
}, TContext>;
/**
 * @summary Use Gemini to autofill a single step
 */
export declare const getAiAutofillStepUrl: () => string;
export declare const aiAutofillStep: (aiAutofillStepBody: AiAutofillStepBody, options?: RequestInit) => Promise<AiAutofillStepResponse>;
export declare const getAiAutofillStepMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof aiAutofillStep>>, TError, {
        data: BodyType<AiAutofillStepBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof aiAutofillStep>>, TError, {
    data: BodyType<AiAutofillStepBody>;
}, TContext>;
export type AiAutofillStepMutationResult = NonNullable<Awaited<ReturnType<typeof aiAutofillStep>>>;
export type AiAutofillStepMutationBody = BodyType<AiAutofillStepBody>;
export type AiAutofillStepMutationError = ErrorType<unknown>;
/**
 * @summary Use Gemini to autofill a single step
 */
export declare const useAiAutofillStep: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof aiAutofillStep>>, TError, {
        data: BodyType<AiAutofillStepBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof aiAutofillStep>>, TError, {
    data: BodyType<AiAutofillStepBody>;
}, TContext>;
/**
 * @summary List all forms for a guide
 */
export declare const getListGuideFormsUrl: (id: number) => string;
export declare const listGuideForms: (id: number, options?: RequestInit) => Promise<GuideForm[]>;
export declare const getListGuideFormsQueryKey: (id: number) => readonly [`/api/guides/${number}/forms`];
export declare const getListGuideFormsQueryOptions: <TData = Awaited<ReturnType<typeof listGuideForms>>, TError = ErrorType<unknown>>(id: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listGuideForms>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listGuideForms>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListGuideFormsQueryResult = NonNullable<Awaited<ReturnType<typeof listGuideForms>>>;
export type ListGuideFormsQueryError = ErrorType<unknown>;
/**
 * @summary List all forms for a guide
 */
export declare function useListGuideForms<TData = Awaited<ReturnType<typeof listGuideForms>>, TError = ErrorType<unknown>>(id: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listGuideForms>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Create a new form for a guide
 */
export declare const getCreateGuideFormUrl: (id: number) => string;
export declare const createGuideForm: (id: number, createGuideFormBody: CreateGuideFormBody, options?: RequestInit) => Promise<GuideForm>;
export declare const getCreateGuideFormMutationOptions: <TError = ErrorType<ApiError>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createGuideForm>>, TError, {
        id: number;
        data: BodyType<CreateGuideFormBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof createGuideForm>>, TError, {
    id: number;
    data: BodyType<CreateGuideFormBody>;
}, TContext>;
export type CreateGuideFormMutationResult = NonNullable<Awaited<ReturnType<typeof createGuideForm>>>;
export type CreateGuideFormMutationBody = BodyType<CreateGuideFormBody>;
export type CreateGuideFormMutationError = ErrorType<ApiError>;
/**
 * @summary Create a new form for a guide
 */
export declare const useCreateGuideForm: <TError = ErrorType<ApiError>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createGuideForm>>, TError, {
        id: number;
        data: BodyType<CreateGuideFormBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof createGuideForm>>, TError, {
    id: number;
    data: BodyType<CreateGuideFormBody>;
}, TContext>;
/**
 * @summary Get a form by ID
 */
export declare const getGetGuideFormUrl: (id: number) => string;
export declare const getGuideForm: (id: number, options?: RequestInit) => Promise<GuideForm>;
export declare const getGetGuideFormQueryKey: (id: number) => readonly [`/api/forms/${number}`];
export declare const getGetGuideFormQueryOptions: <TData = Awaited<ReturnType<typeof getGuideForm>>, TError = ErrorType<ApiError>>(id: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getGuideForm>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getGuideForm>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetGuideFormQueryResult = NonNullable<Awaited<ReturnType<typeof getGuideForm>>>;
export type GetGuideFormQueryError = ErrorType<ApiError>;
/**
 * @summary Get a form by ID
 */
export declare function useGetGuideForm<TData = Awaited<ReturnType<typeof getGuideForm>>, TError = ErrorType<ApiError>>(id: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getGuideForm>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Update a form
 */
export declare const getUpdateGuideFormUrl: (id: number) => string;
export declare const updateGuideForm: (id: number, updateGuideFormBody: UpdateGuideFormBody, options?: RequestInit) => Promise<GuideForm>;
export declare const getUpdateGuideFormMutationOptions: <TError = ErrorType<ApiError>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateGuideForm>>, TError, {
        id: number;
        data: BodyType<UpdateGuideFormBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof updateGuideForm>>, TError, {
    id: number;
    data: BodyType<UpdateGuideFormBody>;
}, TContext>;
export type UpdateGuideFormMutationResult = NonNullable<Awaited<ReturnType<typeof updateGuideForm>>>;
export type UpdateGuideFormMutationBody = BodyType<UpdateGuideFormBody>;
export type UpdateGuideFormMutationError = ErrorType<ApiError>;
/**
 * @summary Update a form
 */
export declare const useUpdateGuideForm: <TError = ErrorType<ApiError>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateGuideForm>>, TError, {
        id: number;
        data: BodyType<UpdateGuideFormBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof updateGuideForm>>, TError, {
    id: number;
    data: BodyType<UpdateGuideFormBody>;
}, TContext>;
/**
 * @summary Delete a form
 */
export declare const getDeleteGuideFormUrl: (id: number) => string;
export declare const deleteGuideForm: (id: number, options?: RequestInit) => Promise<void>;
export declare const getDeleteGuideFormMutationOptions: <TError = ErrorType<ApiError>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteGuideForm>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof deleteGuideForm>>, TError, {
    id: number;
}, TContext>;
export type DeleteGuideFormMutationResult = NonNullable<Awaited<ReturnType<typeof deleteGuideForm>>>;
export type DeleteGuideFormMutationError = ErrorType<ApiError>;
/**
 * @summary Delete a form
 */
export declare const useDeleteGuideForm: <TError = ErrorType<ApiError>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteGuideForm>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof deleteGuideForm>>, TError, {
    id: number;
}, TContext>;
/**
 * @summary List all submissions for a form
 */
export declare const getListFormSubmissionsUrl: (id: number) => string;
export declare const listFormSubmissions: (id: number, options?: RequestInit) => Promise<GuideFormSubmission[]>;
export declare const getListFormSubmissionsQueryKey: (id: number) => readonly [`/api/forms/${number}/submissions`];
export declare const getListFormSubmissionsQueryOptions: <TData = Awaited<ReturnType<typeof listFormSubmissions>>, TError = ErrorType<ApiError>>(id: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listFormSubmissions>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listFormSubmissions>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListFormSubmissionsQueryResult = NonNullable<Awaited<ReturnType<typeof listFormSubmissions>>>;
export type ListFormSubmissionsQueryError = ErrorType<ApiError>;
/**
 * @summary List all submissions for a form
 */
export declare function useListFormSubmissions<TData = Awaited<ReturnType<typeof listFormSubmissions>>, TError = ErrorType<ApiError>>(id: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listFormSubmissions>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Submit a response to a form
 */
export declare const getSubmitGuideFormUrl: (id: number) => string;
export declare const submitGuideForm: (id: number, submitGuideFormBody: SubmitGuideFormBody, options?: RequestInit) => Promise<GuideFormSubmission>;
export declare const getSubmitGuideFormMutationOptions: <TError = ErrorType<ApiError>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof submitGuideForm>>, TError, {
        id: number;
        data: BodyType<SubmitGuideFormBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof submitGuideForm>>, TError, {
    id: number;
    data: BodyType<SubmitGuideFormBody>;
}, TContext>;
export type SubmitGuideFormMutationResult = NonNullable<Awaited<ReturnType<typeof submitGuideForm>>>;
export type SubmitGuideFormMutationBody = BodyType<SubmitGuideFormBody>;
export type SubmitGuideFormMutationError = ErrorType<ApiError>;
/**
 * @summary Submit a response to a form
 */
export declare const useSubmitGuideForm: <TError = ErrorType<ApiError>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof submitGuideForm>>, TError, {
        id: number;
        data: BodyType<SubmitGuideFormBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof submitGuideForm>>, TError, {
    id: number;
    data: BodyType<SubmitGuideFormBody>;
}, TContext>;
/**
 * @summary Get a public form by its share token (no auth required)
 */
export declare const getGetPublicFormUrl: (token: string) => string;
export declare const getPublicForm: (token: string, options?: RequestInit) => Promise<PublicGuideForm>;
export declare const getGetPublicFormQueryKey: (token: string) => readonly [`/api/public/forms/${string}`];
export declare const getGetPublicFormQueryOptions: <TData = Awaited<ReturnType<typeof getPublicForm>>, TError = ErrorType<ApiError>>(token: string, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getPublicForm>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getPublicForm>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetPublicFormQueryResult = NonNullable<Awaited<ReturnType<typeof getPublicForm>>>;
export type GetPublicFormQueryError = ErrorType<ApiError>;
/**
 * @summary Get a public form by its share token (no auth required)
 */
export declare function useGetPublicForm<TData = Awaited<ReturnType<typeof getPublicForm>>, TError = ErrorType<ApiError>>(token: string, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getPublicForm>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Submit a response to a public form (no auth required)
 */
export declare const getSubmitPublicFormUrl: (token: string) => string;
export declare const submitPublicForm: (token: string, submitGuideFormBody: SubmitGuideFormBody, options?: RequestInit) => Promise<GuideFormSubmission>;
export declare const getSubmitPublicFormMutationOptions: <TError = ErrorType<ApiError>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof submitPublicForm>>, TError, {
        token: string;
        data: BodyType<SubmitGuideFormBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof submitPublicForm>>, TError, {
    token: string;
    data: BodyType<SubmitGuideFormBody>;
}, TContext>;
export type SubmitPublicFormMutationResult = NonNullable<Awaited<ReturnType<typeof submitPublicForm>>>;
export type SubmitPublicFormMutationBody = BodyType<SubmitGuideFormBody>;
export type SubmitPublicFormMutationError = ErrorType<ApiError>;
/**
 * @summary Submit a response to a public form (no auth required)
 */
export declare const useSubmitPublicForm: <TError = ErrorType<ApiError>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof submitPublicForm>>, TError, {
        token: string;
        data: BodyType<SubmitGuideFormBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof submitPublicForm>>, TError, {
    token: string;
    data: BodyType<SubmitGuideFormBody>;
}, TContext>;
/**
 * @summary List all signatures for a guide
 */
export declare const getListGuideSignaturesUrl: (id: number) => string;
export declare const listGuideSignatures: (id: number, options?: RequestInit) => Promise<GuideSignature[]>;
export declare const getListGuideSignaturesQueryKey: (id: number) => readonly [`/api/guides/${number}/signatures`];
export declare const getListGuideSignaturesQueryOptions: <TData = Awaited<ReturnType<typeof listGuideSignatures>>, TError = ErrorType<ApiError>>(id: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listGuideSignatures>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listGuideSignatures>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListGuideSignaturesQueryResult = NonNullable<Awaited<ReturnType<typeof listGuideSignatures>>>;
export type ListGuideSignaturesQueryError = ErrorType<ApiError>;
/**
 * @summary List all signatures for a guide
 */
export declare function useListGuideSignatures<TData = Awaited<ReturnType<typeof listGuideSignatures>>, TError = ErrorType<ApiError>>(id: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listGuideSignatures>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Submit a signed acknowledgment for a guide
 */
export declare const getCreateGuideSignatureUrl: (id: number) => string;
export declare const createGuideSignature: (id: number, createGuideSignatureBody: CreateGuideSignatureBody, options?: RequestInit) => Promise<GuideSignature>;
export declare const getCreateGuideSignatureMutationOptions: <TError = ErrorType<ApiError>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createGuideSignature>>, TError, {
        id: number;
        data: BodyType<CreateGuideSignatureBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof createGuideSignature>>, TError, {
    id: number;
    data: BodyType<CreateGuideSignatureBody>;
}, TContext>;
export type CreateGuideSignatureMutationResult = NonNullable<Awaited<ReturnType<typeof createGuideSignature>>>;
export type CreateGuideSignatureMutationBody = BodyType<CreateGuideSignatureBody>;
export type CreateGuideSignatureMutationError = ErrorType<ApiError>;
/**
 * @summary Submit a signed acknowledgment for a guide
 */
export declare const useCreateGuideSignature: <TError = ErrorType<ApiError>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createGuideSignature>>, TError, {
        id: number;
        data: BodyType<CreateGuideSignatureBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof createGuideSignature>>, TError, {
    id: number;
    data: BodyType<CreateGuideSignatureBody>;
}, TContext>;
/**
 * @summary List all conversations
 */
export declare const getListGeminiConversationsUrl: () => string;
export declare const listGeminiConversations: (options?: RequestInit) => Promise<GeminiConversation[]>;
export declare const getListGeminiConversationsQueryKey: () => readonly ["/api/gemini/conversations"];
export declare const getListGeminiConversationsQueryOptions: <TData = Awaited<ReturnType<typeof listGeminiConversations>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listGeminiConversations>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listGeminiConversations>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListGeminiConversationsQueryResult = NonNullable<Awaited<ReturnType<typeof listGeminiConversations>>>;
export type ListGeminiConversationsQueryError = ErrorType<unknown>;
/**
 * @summary List all conversations
 */
export declare function useListGeminiConversations<TData = Awaited<ReturnType<typeof listGeminiConversations>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listGeminiConversations>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Create a new conversation
 */
export declare const getCreateGeminiConversationUrl: () => string;
export declare const createGeminiConversation: (createGeminiConversationBody: CreateGeminiConversationBody, options?: RequestInit) => Promise<GeminiConversation>;
export declare const getCreateGeminiConversationMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createGeminiConversation>>, TError, {
        data: BodyType<CreateGeminiConversationBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof createGeminiConversation>>, TError, {
    data: BodyType<CreateGeminiConversationBody>;
}, TContext>;
export type CreateGeminiConversationMutationResult = NonNullable<Awaited<ReturnType<typeof createGeminiConversation>>>;
export type CreateGeminiConversationMutationBody = BodyType<CreateGeminiConversationBody>;
export type CreateGeminiConversationMutationError = ErrorType<unknown>;
/**
 * @summary Create a new conversation
 */
export declare const useCreateGeminiConversation: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createGeminiConversation>>, TError, {
        data: BodyType<CreateGeminiConversationBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof createGeminiConversation>>, TError, {
    data: BodyType<CreateGeminiConversationBody>;
}, TContext>;
/**
 * @summary Get conversation with messages
 */
export declare const getGetGeminiConversationUrl: (id: number) => string;
export declare const getGeminiConversation: (id: number, options?: RequestInit) => Promise<GeminiConversationWithMessages>;
export declare const getGetGeminiConversationQueryKey: (id: number) => readonly [`/api/gemini/conversations/${number}`];
export declare const getGetGeminiConversationQueryOptions: <TData = Awaited<ReturnType<typeof getGeminiConversation>>, TError = ErrorType<GeminiError>>(id: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getGeminiConversation>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getGeminiConversation>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetGeminiConversationQueryResult = NonNullable<Awaited<ReturnType<typeof getGeminiConversation>>>;
export type GetGeminiConversationQueryError = ErrorType<GeminiError>;
/**
 * @summary Get conversation with messages
 */
export declare function useGetGeminiConversation<TData = Awaited<ReturnType<typeof getGeminiConversation>>, TError = ErrorType<GeminiError>>(id: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getGeminiConversation>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Delete a conversation
 */
export declare const getDeleteGeminiConversationUrl: (id: number) => string;
export declare const deleteGeminiConversation: (id: number, options?: RequestInit) => Promise<void>;
export declare const getDeleteGeminiConversationMutationOptions: <TError = ErrorType<GeminiError>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteGeminiConversation>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof deleteGeminiConversation>>, TError, {
    id: number;
}, TContext>;
export type DeleteGeminiConversationMutationResult = NonNullable<Awaited<ReturnType<typeof deleteGeminiConversation>>>;
export type DeleteGeminiConversationMutationError = ErrorType<GeminiError>;
/**
 * @summary Delete a conversation
 */
export declare const useDeleteGeminiConversation: <TError = ErrorType<GeminiError>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteGeminiConversation>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof deleteGeminiConversation>>, TError, {
    id: number;
}, TContext>;
/**
 * @summary List messages in a conversation
 */
export declare const getListGeminiMessagesUrl: (id: number) => string;
export declare const listGeminiMessages: (id: number, options?: RequestInit) => Promise<GeminiMessage[]>;
export declare const getListGeminiMessagesQueryKey: (id: number) => readonly [`/api/gemini/conversations/${number}/messages`];
export declare const getListGeminiMessagesQueryOptions: <TData = Awaited<ReturnType<typeof listGeminiMessages>>, TError = ErrorType<unknown>>(id: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listGeminiMessages>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listGeminiMessages>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListGeminiMessagesQueryResult = NonNullable<Awaited<ReturnType<typeof listGeminiMessages>>>;
export type ListGeminiMessagesQueryError = ErrorType<unknown>;
/**
 * @summary List messages in a conversation
 */
export declare function useListGeminiMessages<TData = Awaited<ReturnType<typeof listGeminiMessages>>, TError = ErrorType<unknown>>(id: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listGeminiMessages>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Send a message and receive an AI response (SSE stream)
 */
export declare const getSendGeminiMessageUrl: (id: number) => string;
export declare const sendGeminiMessage: (id: number, sendGeminiMessageBody: SendGeminiMessageBody, options?: RequestInit) => Promise<unknown>;
export declare const getSendGeminiMessageMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof sendGeminiMessage>>, TError, {
        id: number;
        data: BodyType<SendGeminiMessageBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof sendGeminiMessage>>, TError, {
    id: number;
    data: BodyType<SendGeminiMessageBody>;
}, TContext>;
export type SendGeminiMessageMutationResult = NonNullable<Awaited<ReturnType<typeof sendGeminiMessage>>>;
export type SendGeminiMessageMutationBody = BodyType<SendGeminiMessageBody>;
export type SendGeminiMessageMutationError = ErrorType<unknown>;
/**
 * @summary Send a message and receive an AI response (SSE stream)
 */
export declare const useSendGeminiMessage: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof sendGeminiMessage>>, TError, {
        id: number;
        data: BodyType<SendGeminiMessageBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof sendGeminiMessage>>, TError, {
    id: number;
    data: BodyType<SendGeminiMessageBody>;
}, TContext>;
/**
 * @summary Generate an image from a text prompt
 */
export declare const getGenerateGeminiImageUrl: () => string;
export declare const generateGeminiImage: (generateGeminiImageBody: GenerateGeminiImageBody, options?: RequestInit) => Promise<GenerateGeminiImageResponse>;
export declare const getGenerateGeminiImageMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof generateGeminiImage>>, TError, {
        data: BodyType<GenerateGeminiImageBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof generateGeminiImage>>, TError, {
    data: BodyType<GenerateGeminiImageBody>;
}, TContext>;
export type GenerateGeminiImageMutationResult = NonNullable<Awaited<ReturnType<typeof generateGeminiImage>>>;
export type GenerateGeminiImageMutationBody = BodyType<GenerateGeminiImageBody>;
export type GenerateGeminiImageMutationError = ErrorType<unknown>;
/**
 * @summary Generate an image from a text prompt
 */
export declare const useGenerateGeminiImage: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof generateGeminiImage>>, TError, {
        data: BodyType<GenerateGeminiImageBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof generateGeminiImage>>, TError, {
    data: BodyType<GenerateGeminiImageBody>;
}, TContext>;
/**
 * @summary Analyze screenshots and generate guide steps using Gemini Vision
 */
export declare const getAnalyzeScreenshotsUrl: () => string;
export declare const analyzeScreenshots: (analyzeScreenshotsBody: AnalyzeScreenshotsBody, options?: RequestInit) => Promise<AnalyzeScreenshotsResponse>;
export declare const getAnalyzeScreenshotsMutationOptions: <TError = ErrorType<ApiError>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof analyzeScreenshots>>, TError, {
        data: BodyType<AnalyzeScreenshotsBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof analyzeScreenshots>>, TError, {
    data: BodyType<AnalyzeScreenshotsBody>;
}, TContext>;
export type AnalyzeScreenshotsMutationResult = NonNullable<Awaited<ReturnType<typeof analyzeScreenshots>>>;
export type AnalyzeScreenshotsMutationBody = BodyType<AnalyzeScreenshotsBody>;
export type AnalyzeScreenshotsMutationError = ErrorType<ApiError>;
/**
 * @summary Analyze screenshots and generate guide steps using Gemini Vision
 */
export declare const useAnalyzeScreenshots: <TError = ErrorType<ApiError>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof analyzeScreenshots>>, TError, {
        data: BodyType<AnalyzeScreenshotsBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof analyzeScreenshots>>, TError, {
    data: BodyType<AnalyzeScreenshotsBody>;
}, TContext>;
export {};
//# sourceMappingURL=api.d.ts.map
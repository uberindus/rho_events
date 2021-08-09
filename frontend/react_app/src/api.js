import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { getMyId, getAuthToken} from "./utils";

function providesTagsForList(result, type){
  return result
  ? // successful query
    [
      ...result.map(({ id }) => ({ type, id })),
      { type, id: 'LIST' },
    ]
  : 
    [{ type, id: 'LIST' }]
}

function prepareHeaders(headers) {

  const auth_token =  getAuthToken()
  if (auth_token) {
    headers.append("Authorization", `Token ${auth_token}`)
  }
  return headers
}

function buildRequestSet(build, tagType, baseEndpoint){
  return (
    {
      ["get" + tagType]: build.query({
        query: (filters) => {
          const x = 1;
          const params = filters ? "?" + new URLSearchParams(filters) : ""
          return baseEndpoint + params
        },
        providesTags: (result) => providesTagsForList(result, tagType)
      }),
      ["add" + tagType]: build.mutation({
        query(body) {
          return ({
            url: baseEndpoint,
            method: 'POST',
            body,
          });
        },
        invalidatesTags: [{ type: tagType, id: 'LIST' }],
      }),
      ["get" + tagType.slice(0,-1)]: build.query({
        query: (id) => `${baseEndpoint}${id}/`,
        providesTags: (result, error, id) => [{ type: tagType, id }],
      }),
      ["update" + tagType.slice(0,-1)]: build.mutation({
        query(data) {
          const { id, ...body } = data;
          return ({
            url: `${baseEndpoint}${id}/`,
            method: 'PATCH',
            body,
          });
        },
        invalidatesTags: (result, error, { id }) => [{ type: tagType, id }],
      }),
      ["delete" + tagType.slice(0,-1)]: build.mutation({
        query(id) {
          return ({
            url: `${baseEndpoint}${id}/`,
            method: 'DELETE',
          });
        },
        invalidatesTags: (result, error, id) => [{ type: tagType, id}],
      })
    }
  );
};


export const api = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: `${process.env.REACT_APP_API_URL}/api/`, prepareHeaders}),
  tagTypes: ['Users', "Avatars", "RegionalBranches, ProffInterestsUsers, ProffInterests"],
  endpoints: (build) => ({
    ...buildRequestSet(build, "Users", "users/"),
    "updateUser": build.mutation({
      query(data) {
        const { id, ...body } = data;
        return ({
          url: `users/${id}/`,
          method: 'PATCH',
          body,
        });
      },
      invalidatesTags: (result, error, { id }) => [{ type: "Users", id }, {type: "UsersStatusChanges", id: "LIST"}],
    }),
    ...buildRequestSet(build, "RegionalBranches", "regional-branches/"),
    ...buildRequestSet(build, "ProffInterests", "proff-interests/"),
    ...buildRequestSet(build, "Organizations", "organizations/"),
    ...buildRequestSet(build, "Avatars", "avatars/"),
    ...buildRequestSet(build, "ProffInterestsUsers", "proff-interests-users/"),
    ...buildRequestSet(build, "AcademicTitles", "academic-titles/"),
    ...buildRequestSet(build, "AcademicTitlesUsers", "academic-titles-users/"),
    ...buildRequestSet(build, "Affiliations", "affiliations/"),
    ...buildRequestSet(build, "UsersStatusChanges", "status-changed-records-users/"),
    ...buildRequestSet(build, "EventsStatusChanges", "status-changed-records-events/"),
    ...buildRequestSet(build, "Events", "events/"),
    ...buildRequestSet(build, "EventOrganizations", "event-organizations/"),
    "updateEvent": build.mutation({
      query(data) {
        const { id, ...body } = data;
        return ({
          url: `events/${id}/`,
          method: 'PATCH',
          body,
        });
      },
      invalidatesTags: (result, error, { id }) => [{ type: "Events", id }, {type: "EventsStatusChanges", id: "LIST"}],
    }),
    "updateAvatar": build.mutation({
      query(data) {
        const {id, form} = data;
        return ({
          url: `avatars/${id}/`,
          method: 'PATCH',
          body: form,
        });
      },
      invalidatesTags: (result, error, { id }) => [{ type: "Avatars", id }],
    }),
  }),
})

export const {
  useGetUserQuery,
  useGetUsersQuery,
  useUpdateUserMutation,

  useGetAvatarQuery,
  useUpdateAvatarMutation,
  
  
  useGetRegionalBranchesQuery,
  
  useGetOrganizationsQuery,
  useAddOrganizationsMutation,
  
  useGetProffInterestsQuery,
  useGetProffInterestsUsersQuery,
  useAddProffInterestsUsersMutation,
  useDeleteProffInterestsUserMutation,
  
  
  useGetAcademicTitlesQuery,
  useGetAcademicTitlesUsersQuery,
  useAddAcademicTitlesUsersMutation,
  useDeleteAcademicTitlesUserMutation,
  
  useGetAffiliationsQuery,
  useAddAffiliationsMutation,
  useUpdateAffiliationMutation,
  useDeleteAffiliationMutation,

  useGetEventOrganizationsQuery,
  useAddEventOrganizationsMutation,
  useUpdateEventOrganizationMutation,
  useDeleteEventOrganizationMutation,
  
  useGetUsersStatusChangesQuery,
  useGetEventsStatusChangesQuery,
  
  useGetEventsQuery,
  useAddEventsMutation,
  useGetEventQuery,
  useUpdateEventMutation,
  useDeleteEventMutation,

} = api
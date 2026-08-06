import type { DocumentNode } from "graphql";

import { gql } from "@/__generated__";

export const GET_RESOURCES_QUERY = gql(`
  query GetResources($projectId: ID!) {
    getResources(projectId: $projectId) {
      nodes {
        id
        projectId
        type
        title
        url
        fileUrl
        fileName
        fileType
        size
        visibility
        createdById
        viewerIds
        createdAt
      }
    }
  }
`) as DocumentNode;

export const CREATE_RESOURCE_MUTATION = gql(`
  mutation CreateResource(
    $projectId: ID!
    $type: ResourceTypeEnumType!
    $title: String!
    $url: String
    $fileUrl: String
    $fileName: String
    $fileType: String
    $size: Int
    $visibility: ResourceVisibilityEnumType
    $viewerIds: [ID!]
  ) {
    createResource(
      projectId: $projectId
      type: $type
      title: $title
      url: $url
      fileUrl: $fileUrl
      fileName: $fileName
      fileType: $fileType
      size: $size
      visibility: $visibility
      viewerIds: $viewerIds
    ) {
      id
      projectId
      type
      title
      url
      fileUrl
      fileName
      fileType
      size
      visibility
      createdById
      viewerIds
      createdAt
    }
  }
`) as DocumentNode;

export const UPDATE_RESOURCE_MUTATION = gql(`
  mutation UpdateResource(
    $id: ID!
    $title: String
    $visibility: ResourceVisibilityEnumType
    $viewerIds: [ID!]
  ) {
    updateResource(id: $id, title: $title, visibility: $visibility, viewerIds: $viewerIds) {
      id
      projectId
      type
      title
      url
      fileUrl
      fileName
      fileType
      size
      visibility
      createdById
      viewerIds
      createdAt
    }
  }
`) as DocumentNode;

export const DELETE_RESOURCE_MUTATION = gql(`
  mutation DeleteResource($id: ID!) {
    deleteResource(id: $id)
  }
`) as DocumentNode;

import type { DocumentNode } from "graphql";

import { gql } from "@/__generated__";

export const GET_FOLDERS_QUERY = gql(`
  query GetFolders {
    getFolders {
      nodes {
        id
        name
        parentId
        noteCount
        children {
          id
          name
          parentId
          noteCount
          children {
            id
            name
            parentId
            noteCount
            children {
              id
              name
              parentId
              noteCount
            }
          }
        }
      }
    }
  }
`) as DocumentNode;

export const GET_NOTES_QUERY = gql(`
  query GetNotes($folderId: ID, $all: Boolean) {
    getNotes(folderId: $folderId, all: $all) {
      nodes {
        id
        title
        content
        folderId
        createdAt
        updatedAt
      }
    }
  }
`) as DocumentNode;

export const GET_NOTE_QUERY = gql(`
  query GetNote($id: ID!) {
    getNote(id: $id) {
      id
      title
      content
      folderId
      createdAt
      updatedAt
    }
  }
`) as DocumentNode;

export const CREATE_FOLDER_MUTATION = gql(`
  mutation CreateFolder($name: String!, $parentId: ID) {
    createFolder(name: $name, parentId: $parentId) {
      id
      name
      parentId
      noteCount
    }
  }
`) as DocumentNode;

export const UPDATE_FOLDER_MUTATION = gql(`
  mutation UpdateFolder($id: ID!, $name: String, $parentId: ID) {
    updateFolder(id: $id, name: $name, parentId: $parentId) {
      id
      name
      parentId
      noteCount
    }
  }
`) as DocumentNode;

export const DELETE_FOLDER_MUTATION = gql(`
  mutation DeleteFolder($id: ID!) {
    deleteFolder(id: $id)
  }
`) as DocumentNode;

export const CREATE_NOTE_MUTATION = gql(`
  mutation CreateNote($title: String!, $content: String, $folderId: ID!) {
    createNote(title: $title, content: $content, folderId: $folderId) {
      id
      title
      content
      folderId
      createdAt
      updatedAt
    }
  }
`) as DocumentNode;

export const UPDATE_NOTE_MUTATION = gql(`
  mutation UpdateNote($id: ID!, $title: String, $content: String, $folderId: ID) {
    updateNote(id: $id, title: $title, content: $content, folderId: $folderId) {
      id
      title
      content
      folderId
      createdAt
      updatedAt
    }
  }
`) as DocumentNode;

export const DELETE_NOTE_MUTATION = gql(`
  mutation DeleteNote($id: ID!) {
    deleteNote(id: $id)
  }
`) as DocumentNode;

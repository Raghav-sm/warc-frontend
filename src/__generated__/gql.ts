/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
    "\n  query AuthBootMe {\n    me {\n      id\n      email\n      firstName\n      lastName\n      fullName\n      roleId\n      roleCode\n      roleName\n      isActive\n      permissions\n      createdAt\n      updatedAt\n    }\n  }\n": typeof types.AuthBootMeDocument,
    "\n  mutation Logout($refreshToken: String!) {\n    logout(refreshToken: $refreshToken)\n  }\n": typeof types.LogoutDocument,
    "\n  mutation Login(\n    $emailOrEmployeeNumber: String!\n    $password: String!\n    $rememberMe: Boolean\n  ) {\n    login(\n      emailOrEmployeeNumber: $emailOrEmployeeNumber\n      password: $password\n      rememberMe: $rememberMe\n    ) {\n      accessToken\n      refreshToken\n    }\n  }\n": typeof types.LoginDocument,
    "\n  mutation SignUp(\n    $firstName: String!\n    $lastName: String!\n    $email: String!\n    $password: String!\n    $rememberMe: Boolean\n  ) {\n    signUp(\n      firstName: $firstName\n      lastName: $lastName\n      email: $email\n      password: $password\n      rememberMe: $rememberMe\n    ) {\n      accessToken\n      refreshToken\n    }\n  }\n": typeof types.SignUpDocument,
    "\n  query DashboardOverview {\n    getDashboard {\n      kpis {\n        key\n        title\n        subtitle\n        value\n        tone\n      }\n      recentUsers {\n        id\n        email\n        firstName\n        lastName\n        roleName\n        isActive\n        createdAt\n      }\n    }\n  }\n": typeof types.DashboardOverviewDocument,
    "\n  query Me {\n    me {\n      id\n      email\n      firstName\n      lastName\n      roleName\n      sessions {\n        nodes {\n          id\n          expiresAt\n          userAgent\n          ipAddress\n          revoked\n          revokedAt\n          createdAt\n        }\n        pageInfo {\n          totalCount\n        }\n      }\n    }\n  }\n": typeof types.MeDocument,
    "\n  mutation UpdateUser($firstName: String, $lastName: String, $email: String) {\n    updateUser(firstName: $firstName, lastName: $lastName, email: $email) {\n      id\n    }\n  }\n": typeof types.UpdateUserDocument,
    "\n  mutation CreateRole(\n    $name: String!\n    $code: String!\n    $description: String\n    $permissionCodes: [PermissionEnumType!]!\n  ) {\n    createRole(\n      name: $name\n      code: $code\n      description: $description\n      permissionCodes: $permissionCodes\n    ) {\n      id\n    }\n  }\n": typeof types.CreateRoleDocument,
    "\n  query Role($id: ID!) {\n    getRole(id: $id) {\n      id\n      code\n      name\n      description\n      permissions\n    }\n  }\n": typeof types.RoleDocument,
    "\n  mutation UpdateRole(\n    $id: ID!\n    $name: String\n    $description: String\n    $permissionCodes: [PermissionEnumType!]\n  ) {\n    updateRole(\n      id: $id\n      name: $name\n      description: $description\n      permissionCodes: $permissionCodes\n    ) {\n      id\n    }\n  }\n": typeof types.UpdateRoleDocument,
    "\n  query Roles($page: Int, $limit: Int, $filters: RoleFilterInputType) {\n    getRoles(page: $page, limit: $limit, filters: $filters) {\n      nodes {\n        id\n        code\n        name\n        description\n        createdAt\n      }\n      pageInfo {\n        isFirstPage\n        isLastPage\n        currentPage\n        previousPage\n        nextPage\n        pageCount\n        totalCount\n      }\n    }\n  }\n": typeof types.RolesDocument,
    "\n  query Users($page: Int, $limit: Int, $filters: UserFilterInputType) {\n    getUsers(page: $page, limit: $limit, filters: $filters) {\n      nodes {\n        id\n        email\n        firstName\n        lastName\n        fullName\n        roleName\n        roleCode\n        isActive\n        createdAt\n      }\n      pageInfo {\n        isFirstPage\n        isLastPage\n        currentPage\n        previousPage\n        nextPage\n        pageCount\n        totalCount\n      }\n    }\n  }\n": typeof types.UsersDocument,
    "\n  mutation RefreshToken($refreshToken: String!) {\n    refreshToken(refreshToken: $refreshToken) {\n      accessToken\n      refreshToken\n    }\n  }\n": typeof types.RefreshTokenDocument,
};
const documents: Documents = {
    "\n  query AuthBootMe {\n    me {\n      id\n      email\n      firstName\n      lastName\n      fullName\n      roleId\n      roleCode\n      roleName\n      isActive\n      permissions\n      createdAt\n      updatedAt\n    }\n  }\n": types.AuthBootMeDocument,
    "\n  mutation Logout($refreshToken: String!) {\n    logout(refreshToken: $refreshToken)\n  }\n": types.LogoutDocument,
    "\n  mutation Login(\n    $emailOrEmployeeNumber: String!\n    $password: String!\n    $rememberMe: Boolean\n  ) {\n    login(\n      emailOrEmployeeNumber: $emailOrEmployeeNumber\n      password: $password\n      rememberMe: $rememberMe\n    ) {\n      accessToken\n      refreshToken\n    }\n  }\n": types.LoginDocument,
    "\n  mutation SignUp(\n    $firstName: String!\n    $lastName: String!\n    $email: String!\n    $password: String!\n    $rememberMe: Boolean\n  ) {\n    signUp(\n      firstName: $firstName\n      lastName: $lastName\n      email: $email\n      password: $password\n      rememberMe: $rememberMe\n    ) {\n      accessToken\n      refreshToken\n    }\n  }\n": types.SignUpDocument,
    "\n  query DashboardOverview {\n    getDashboard {\n      kpis {\n        key\n        title\n        subtitle\n        value\n        tone\n      }\n      recentUsers {\n        id\n        email\n        firstName\n        lastName\n        roleName\n        isActive\n        createdAt\n      }\n    }\n  }\n": types.DashboardOverviewDocument,
    "\n  query Me {\n    me {\n      id\n      email\n      firstName\n      lastName\n      roleName\n      sessions {\n        nodes {\n          id\n          expiresAt\n          userAgent\n          ipAddress\n          revoked\n          revokedAt\n          createdAt\n        }\n        pageInfo {\n          totalCount\n        }\n      }\n    }\n  }\n": types.MeDocument,
    "\n  mutation UpdateUser($firstName: String, $lastName: String, $email: String) {\n    updateUser(firstName: $firstName, lastName: $lastName, email: $email) {\n      id\n    }\n  }\n": types.UpdateUserDocument,
    "\n  mutation CreateRole(\n    $name: String!\n    $code: String!\n    $description: String\n    $permissionCodes: [PermissionEnumType!]!\n  ) {\n    createRole(\n      name: $name\n      code: $code\n      description: $description\n      permissionCodes: $permissionCodes\n    ) {\n      id\n    }\n  }\n": types.CreateRoleDocument,
    "\n  query Role($id: ID!) {\n    getRole(id: $id) {\n      id\n      code\n      name\n      description\n      permissions\n    }\n  }\n": types.RoleDocument,
    "\n  mutation UpdateRole(\n    $id: ID!\n    $name: String\n    $description: String\n    $permissionCodes: [PermissionEnumType!]\n  ) {\n    updateRole(\n      id: $id\n      name: $name\n      description: $description\n      permissionCodes: $permissionCodes\n    ) {\n      id\n    }\n  }\n": types.UpdateRoleDocument,
    "\n  query Roles($page: Int, $limit: Int, $filters: RoleFilterInputType) {\n    getRoles(page: $page, limit: $limit, filters: $filters) {\n      nodes {\n        id\n        code\n        name\n        description\n        createdAt\n      }\n      pageInfo {\n        isFirstPage\n        isLastPage\n        currentPage\n        previousPage\n        nextPage\n        pageCount\n        totalCount\n      }\n    }\n  }\n": types.RolesDocument,
    "\n  query Users($page: Int, $limit: Int, $filters: UserFilterInputType) {\n    getUsers(page: $page, limit: $limit, filters: $filters) {\n      nodes {\n        id\n        email\n        firstName\n        lastName\n        fullName\n        roleName\n        roleCode\n        isActive\n        createdAt\n      }\n      pageInfo {\n        isFirstPage\n        isLastPage\n        currentPage\n        previousPage\n        nextPage\n        pageCount\n        totalCount\n      }\n    }\n  }\n": types.UsersDocument,
    "\n  mutation RefreshToken($refreshToken: String!) {\n    refreshToken(refreshToken: $refreshToken) {\n      accessToken\n      refreshToken\n    }\n  }\n": types.RefreshTokenDocument,
};

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = gql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function gql(source: string): unknown;

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query AuthBootMe {\n    me {\n      id\n      email\n      firstName\n      lastName\n      fullName\n      roleId\n      roleCode\n      roleName\n      isActive\n      permissions\n      createdAt\n      updatedAt\n    }\n  }\n"): (typeof documents)["\n  query AuthBootMe {\n    me {\n      id\n      email\n      firstName\n      lastName\n      fullName\n      roleId\n      roleCode\n      roleName\n      isActive\n      permissions\n      createdAt\n      updatedAt\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation Logout($refreshToken: String!) {\n    logout(refreshToken: $refreshToken)\n  }\n"): (typeof documents)["\n  mutation Logout($refreshToken: String!) {\n    logout(refreshToken: $refreshToken)\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation Login(\n    $emailOrEmployeeNumber: String!\n    $password: String!\n    $rememberMe: Boolean\n  ) {\n    login(\n      emailOrEmployeeNumber: $emailOrEmployeeNumber\n      password: $password\n      rememberMe: $rememberMe\n    ) {\n      accessToken\n      refreshToken\n    }\n  }\n"): (typeof documents)["\n  mutation Login(\n    $emailOrEmployeeNumber: String!\n    $password: String!\n    $rememberMe: Boolean\n  ) {\n    login(\n      emailOrEmployeeNumber: $emailOrEmployeeNumber\n      password: $password\n      rememberMe: $rememberMe\n    ) {\n      accessToken\n      refreshToken\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation SignUp(\n    $firstName: String!\n    $lastName: String!\n    $email: String!\n    $password: String!\n    $rememberMe: Boolean\n  ) {\n    signUp(\n      firstName: $firstName\n      lastName: $lastName\n      email: $email\n      password: $password\n      rememberMe: $rememberMe\n    ) {\n      accessToken\n      refreshToken\n    }\n  }\n"): (typeof documents)["\n  mutation SignUp(\n    $firstName: String!\n    $lastName: String!\n    $email: String!\n    $password: String!\n    $rememberMe: Boolean\n  ) {\n    signUp(\n      firstName: $firstName\n      lastName: $lastName\n      email: $email\n      password: $password\n      rememberMe: $rememberMe\n    ) {\n      accessToken\n      refreshToken\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query DashboardOverview {\n    getDashboard {\n      kpis {\n        key\n        title\n        subtitle\n        value\n        tone\n      }\n      recentUsers {\n        id\n        email\n        firstName\n        lastName\n        roleName\n        isActive\n        createdAt\n      }\n    }\n  }\n"): (typeof documents)["\n  query DashboardOverview {\n    getDashboard {\n      kpis {\n        key\n        title\n        subtitle\n        value\n        tone\n      }\n      recentUsers {\n        id\n        email\n        firstName\n        lastName\n        roleName\n        isActive\n        createdAt\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query Me {\n    me {\n      id\n      email\n      firstName\n      lastName\n      roleName\n      sessions {\n        nodes {\n          id\n          expiresAt\n          userAgent\n          ipAddress\n          revoked\n          revokedAt\n          createdAt\n        }\n        pageInfo {\n          totalCount\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query Me {\n    me {\n      id\n      email\n      firstName\n      lastName\n      roleName\n      sessions {\n        nodes {\n          id\n          expiresAt\n          userAgent\n          ipAddress\n          revoked\n          revokedAt\n          createdAt\n        }\n        pageInfo {\n          totalCount\n        }\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation UpdateUser($firstName: String, $lastName: String, $email: String) {\n    updateUser(firstName: $firstName, lastName: $lastName, email: $email) {\n      id\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateUser($firstName: String, $lastName: String, $email: String) {\n    updateUser(firstName: $firstName, lastName: $lastName, email: $email) {\n      id\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation CreateRole(\n    $name: String!\n    $code: String!\n    $description: String\n    $permissionCodes: [PermissionEnumType!]!\n  ) {\n    createRole(\n      name: $name\n      code: $code\n      description: $description\n      permissionCodes: $permissionCodes\n    ) {\n      id\n    }\n  }\n"): (typeof documents)["\n  mutation CreateRole(\n    $name: String!\n    $code: String!\n    $description: String\n    $permissionCodes: [PermissionEnumType!]!\n  ) {\n    createRole(\n      name: $name\n      code: $code\n      description: $description\n      permissionCodes: $permissionCodes\n    ) {\n      id\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query Role($id: ID!) {\n    getRole(id: $id) {\n      id\n      code\n      name\n      description\n      permissions\n    }\n  }\n"): (typeof documents)["\n  query Role($id: ID!) {\n    getRole(id: $id) {\n      id\n      code\n      name\n      description\n      permissions\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation UpdateRole(\n    $id: ID!\n    $name: String\n    $description: String\n    $permissionCodes: [PermissionEnumType!]\n  ) {\n    updateRole(\n      id: $id\n      name: $name\n      description: $description\n      permissionCodes: $permissionCodes\n    ) {\n      id\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateRole(\n    $id: ID!\n    $name: String\n    $description: String\n    $permissionCodes: [PermissionEnumType!]\n  ) {\n    updateRole(\n      id: $id\n      name: $name\n      description: $description\n      permissionCodes: $permissionCodes\n    ) {\n      id\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query Roles($page: Int, $limit: Int, $filters: RoleFilterInputType) {\n    getRoles(page: $page, limit: $limit, filters: $filters) {\n      nodes {\n        id\n        code\n        name\n        description\n        createdAt\n      }\n      pageInfo {\n        isFirstPage\n        isLastPage\n        currentPage\n        previousPage\n        nextPage\n        pageCount\n        totalCount\n      }\n    }\n  }\n"): (typeof documents)["\n  query Roles($page: Int, $limit: Int, $filters: RoleFilterInputType) {\n    getRoles(page: $page, limit: $limit, filters: $filters) {\n      nodes {\n        id\n        code\n        name\n        description\n        createdAt\n      }\n      pageInfo {\n        isFirstPage\n        isLastPage\n        currentPage\n        previousPage\n        nextPage\n        pageCount\n        totalCount\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query Users($page: Int, $limit: Int, $filters: UserFilterInputType) {\n    getUsers(page: $page, limit: $limit, filters: $filters) {\n      nodes {\n        id\n        email\n        firstName\n        lastName\n        fullName\n        roleName\n        roleCode\n        isActive\n        createdAt\n      }\n      pageInfo {\n        isFirstPage\n        isLastPage\n        currentPage\n        previousPage\n        nextPage\n        pageCount\n        totalCount\n      }\n    }\n  }\n"): (typeof documents)["\n  query Users($page: Int, $limit: Int, $filters: UserFilterInputType) {\n    getUsers(page: $page, limit: $limit, filters: $filters) {\n      nodes {\n        id\n        email\n        firstName\n        lastName\n        fullName\n        roleName\n        roleCode\n        isActive\n        createdAt\n      }\n      pageInfo {\n        isFirstPage\n        isLastPage\n        currentPage\n        previousPage\n        nextPage\n        pageCount\n        totalCount\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation RefreshToken($refreshToken: String!) {\n    refreshToken(refreshToken: $refreshToken) {\n      accessToken\n      refreshToken\n    }\n  }\n"): (typeof documents)["\n  mutation RefreshToken($refreshToken: String!) {\n    refreshToken(refreshToken: $refreshToken) {\n      accessToken\n      refreshToken\n    }\n  }\n"];

export function gql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;
type PaginatedData = {
  nodes?: unknown[];
  pageInfo?: { cursor?: string } & Record<string, unknown>;
  statistics?: unknown;
};

export default function paginationHelper(keyArgs: false | readonly (string | readonly string[])[] = false) {
  return {
    keyArgs,
    merge: (
      existing: PaginatedData | undefined,
      incoming: PaginatedData | undefined,
      options: { args?: Record<string, unknown> | null },
    ) => {
      const args = options?.args;
      if (!incoming) {
        return existing;
      }

      if (args?.cursor == null && args?.page == null) {
        return incoming;
      }

      if (!existing) {
        return incoming || makeEmptyData();
      }

      if (args?.cursor && existing.pageInfo?.cursor === incoming.pageInfo?.cursor) {
        return existing;
      }

      if (args?.page && args.page === 1) {
        return incoming;
      }

      const existingNodes = existing?.nodes ?? [];
      const incomingNodes = incoming?.nodes ?? [];

      return {
        nodes: [...existingNodes, ...incomingNodes],
        pageInfo: incoming.pageInfo ?? existing.pageInfo,
        statistics: incoming.statistics ?? existing.statistics,
      };
    },
  };
}

function makeEmptyData(): PaginatedData {
  return {
    nodes: [],
    pageInfo: {
      cursor: "",
    },
  };
}

export interface PaginatedResponse {
    page: {
      total: number;
      data: any;
    };
    totalPages: number;
  }
  
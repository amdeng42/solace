import type { PaginatedResponse, SearchMetadata } from "@/app/types";

class ApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = "/api";
  }

  async getSearchMetadata(): Promise<SearchMetadata> {
    const response = await fetch(`${this.baseUrl}/metadata`);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    return response.json();
  }

  async getAdvocates(
    search: string,
    specialty: string,
    city: string,
    page: number = 1, 
    pageSize: number = 10
  ): Promise<PaginatedResponse> {

    const params = new URLSearchParams();
    if (search) {
      params.append("search", search);
    }
    if (specialty) {
      params.append("specialty", specialty);
    }
    if (city) {
      params.append("city", city);
    }
    
    params.append("page", page.toString());
    params.append("pageSize", pageSize.toString());
    
    const response = await fetch(`${this.baseUrl}/advocates?${params.toString()}`);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    return response.json();
  }
}

const client = new ApiClient();
export default client;
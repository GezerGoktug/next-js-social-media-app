import { ApiError } from "@/error/ApiError";

type HttpMethod = "GET" | "POST" | "DELETE" | "PUT" | "PATCH";

interface ApiResponse<T> {
  data?: T;
  error?: string;
  status?: number;
}

const fetching = async <T>(
  endpoint: string | null,
  method: HttpMethod,
  data: any = null,
  extraOptions: any = {}
): Promise<ApiResponse<T>> => {
  try {
    const { header, isFormData, ...options } = extraOptions;

    const body =
      method !== "GET" && data
        ? { body: isFormData ? data : JSON.stringify(data) }
        : {};

    const res = await fetch(
      process.env.NEXT_PUBLIC_BASE_URL + "/api" + endpoint,
      {
        method,
        headers: header
          ? header
          : {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
        ...body,
        ...options,
      }
    );

    if (!res.ok) {
      const errorRes = await res.json();
      throw new ApiError(
        errorRes.message || "Veri alınırken bir hata oluştu",
        res.status
      );
    }

    const jsonData: T = await res.json();
    return { data: jsonData, status: res.status };
  } catch (error: any) {
    return {
      error: error.message || "Bir hata oluştu",
      status: error.code || 500,
    };
  }
};

const api = {
  get: async <T>(
    endpoint: string,
    extraOptions?: any
  ): Promise<ApiResponse<T>> => {
    return await fetching<T>(endpoint, "GET", null, extraOptions);
  },
  post: async <T>(
    endpoint: string,
    data: any,
    extraOptions?: any
  ): Promise<ApiResponse<T>> => {
    return await fetching<T>(endpoint, "POST", data, extraOptions);
  },
  put: async <T>(
    endpoint: string,
    data: any,
    extraOptions?: any
  ): Promise<ApiResponse<T>> => {
    return await fetching<T>(endpoint, "PUT", data, extraOptions);
  },
  patch: async <T>(
    endpoint: string,
    data: any,
    extraOptions?: any
  ): Promise<ApiResponse<T>> => {
    return await fetching<T>(endpoint, "PATCH", data, extraOptions);
  },
  delete: async <T>(
    endpoint: string,
    data: any,
    extraOptions?: any
  ): Promise<ApiResponse<T>> => {
    return await fetching<T>(endpoint, "DELETE", data, extraOptions);
  },
} as const;

export default api;

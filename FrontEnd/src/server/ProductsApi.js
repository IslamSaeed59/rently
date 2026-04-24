import axios from "axios";

const API_URL = "http://localhost:9000/api/";

const ProductsApi = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor: Attach token to every request
ProductsApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response Interceptor: Handle session expiration (401)
ProductsApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear storage and redirect to login if unauthorized
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);
// Products API
// createProduct
export const createProduct = async (productData) => {
  try {
    const response = await ProductsApi.post("products", productData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};
// getAllProducts
export const getAllProducts = async (params = {}) => {
  try {
    const response = await ProductsApi.get("products", { params });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

export const getMyListings = async () => {
  try {
    const response = await ProductsApi.get("products/seller/my-listings");
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

export const getProductById = async (id) => {
  try {
    const response = await ProductsApi.get(`products/${id}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

export const updateProduct = async (id, productData) => {
  try {
    const response = await ProductsApi.put(`products/${id}`, productData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

// deleteProduct
export const deleteProduct = async (id) => {
  try {
    const response = await ProductsApi.delete(`products/${id}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};


// Rental Requests
export const createRentalRequest = async (requestData) => {
  try {
    const response = await ProductsApi.post("rental-requests", requestData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

export const getMyRequests = async () => {
  try {
    const response = await ProductsApi.get("rental-requests/buyer");
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

export const getReceivedRequests = async () => {
  try {
    const response = await ProductsApi.get("rental-requests/seller");
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

export const updateRequestStatus = async (id, status) => {
  try {
    const response = await ProductsApi.put(`rental-requests/${id}/status`, { status });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

// Rentals
export const createRental = async (rentalData) => {
  try {
    const response = await ProductsApi.post("rentals", rentalData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

export const getMyRentals = async () => {
  try {
    const response = await ProductsApi.get("rentals/buyer");
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

export const getSellerRentals = async () => {
  try {
    const response = await ProductsApi.get("rentals/seller");
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

export const getRentalById = async (id) => {
  try {
    const response = await ProductsApi.get(`rentals/${id}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

export const updateRentalStatus = async (id, status) => {
  try {
    const response = await ProductsApi.put(`rentals/${id}/status`, { status });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

export const updatePaymentStatus = async (id, paymentData) => {
  try {
    const response = await ProductsApi.put(`rentals/${id}/payment`, paymentData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

// Availability & Blackouts
export const getProductAvailability = async (productId, params = {}) => {
  try {
    const response = await ProductsApi.get(`availability/${productId}`, { params });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

export const setAvailability = async (availabilityData) => {
  try {
    const response = await ProductsApi.post("availability/availability", availabilityData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

export const createBlackout = async (blackoutData) => {
  try {
    const response = await ProductsApi.post("availability/blackout", blackoutData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

export const deleteBlackout = async (id) => {
  try {
    const response = await ProductsApi.delete(`availability/blackout/${id}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

export default ProductsApi;


const API_BASE_URL = import.meta.env.VITE_API_URL || "";

async function request(url, options = {}) {
    const response = await fetch(`${API_BASE_URL}${url}`, options);
    const result = await response.json().catch(() => ({}));

    if (!response.ok || result.success === false) {
        throw new Error(result.message || "Yêu cầu thất bại.");
    }

    return result;
}

function authHeaders(token) {
    return { Authorization: `Bearer ${token}` };
}

// CATEGORY
export async function getCategoriesRequest() {
    const result = await request("/api/admin/categories");
    return Array.isArray(result.data) ? result.data : [];
}

export function createCategoryRequest(token, data) {
    return request("/api/admin/categories", {
        method: "POST",
        headers: {
            ...authHeaders(token),
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
}

export function updateCategoryRequest(token, id, data) {
    return request(`/api/admin/categories/${id}`, {
        method: "PUT",
        headers: {
            ...authHeaders(token),
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
}

export function deleteCategoryRequest(token, id) {
    return request(`/api/admin/categories/${id}`, {
        method: "DELETE",
        headers: authHeaders(token),
    });
}

// PRODUCT
export async function getProductsRequest(params = {}) {
    const query = new URLSearchParams(params);
    const result = await request(`/api/products?${query.toString()}`);

    return {
        products: Array.isArray(result.data) ? result.data : [],
        pagination: result.pagination || {
            currentPage: 1,
            totalPages: 1,
            totalProducts: 0,
        },
    };
}

function productFormData(data) {
    const formData = new FormData();

    formData.append("product_name", data.product_name);
    formData.append("price", data.price);
    formData.append("stock", data.stock);
    formData.append("category_id", data.category_id);
    formData.append("description", data.description || "");

    if (data.image instanceof File) {
        formData.append("image", data.image);
    }

    return formData;
}

export function createProductRequest(token, data) {
    return request("/api/products", {
        method: "POST",
        headers: authHeaders(token),
        body: productFormData(data),
    });
}

export function updateProductRequest(token, id, data) {
    return request(`/api/products/${id}`, {
        method: "PUT",
        headers: authHeaders(token),
        body: productFormData(data),
    });
}

export function deleteProductRequest(token, id) {
    return request(`/api/products/${id}`, {
        method: "DELETE",
        headers: authHeaders(token),
    });
}

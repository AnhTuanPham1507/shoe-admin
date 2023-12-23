import axios from 'axios'

const axi = axios.create({
  baseURL: `http://localhost:3003`,
});

const productAPI = {
  getBySlug: (slug) => axi.get(`/api/v1/product/${slug}`),
  getAll: (queryParams) => axi.get(`/api/v1/product?${queryParams}`),
  create: (createProduct) =>
    axi.post(`/api/v1/product`, createProduct, {
      headers: {
        'Content-Type': `application/json`,
      },
  }),
  addDetails: (productId, payload) => 
    axi.patch(`/api/v1/product/${productId}/detail`, payload),
  update: (id, payload) => axi.patch(`/api/v1/product/${id}`, payload),
  updateDetail: (id, payload) => axi.patch(`/api/v1/product/detail/${id}`, payload)
};

const categoryAPI = {
  getAll: (queryParams) => axi.get(`/api/v1/category?${queryParams}`),
  create: (payload) =>
    axi.post(`/api/v1/category`, payload),
  update: (id, payload) =>
    axi.patch(`/api/v1/category/${id}`, payload),
  delete: (id) => axi.delete(`/api/v1/category/${id}`)
}

const partnerAPI = {
  getAll: (queryParams) => axi.get(`/api/v1/partner?${queryParams}`),
  create: (payload) =>
    axi.post(`/api/v1/partner`, payload),
  update: (id, payload) =>
    axi.patch(`/api/v1/partner/${id}`, payload),
  delete: (id) => axi.delete(`/api/v1/partner/${id}`)
}

const classificationAPI = {
  getAll: () => axi.get('/api/v1/product-classification')
}

const importWarehouseOrderAPI = {
  getAll: (queryParams) => axi.get(`/api/v1/import-warehouse-order?${queryParams}`),
  create: (payload) => axi.post('/api/v1/import-warehouse-order', payload),
  update: (id, payload) => axi.patch(`/api/v1/import-warehouse-order/${id}`, payload)
}

const orderAPI = {
  getAll: (queryParams) => axi.get(`/api/v1/order?${queryParams}`),
  create: (payload) => axi.post('/api/v1/order', payload),
  update: (id, payload) => axi.patch(`/api/v1/order/${id}`, payload)
}

const seasonalCategoryAPI = {
  getAll: (queryParams) => axi.get(`/api/v1/seasonal-category?${queryParams}`),
  create: (payload) =>
    axi.post(`/api/v1/seasonal-category`, payload),
  update: (id, payload) =>
    axi.patch(`/api/v1/seasonal-category/${id}`, payload),
  delete: (id) => axi.delete(`/api/v1/seasonal-category/${id}`)
}

const imageAPI = {
  create: (payload) => axi.post('/api/v1/image', payload),
  delete: (name) => axi.post(`/api/v1/image/delete`, {imageName: name})
}

const bannerAPI = {
  create: (payload) => axi.post('/api/v1/banner', payload),
  getAll: (queryParams) => axi.get(`/api/v1/banner?${queryParams}`),
  update: (id, payload) =>
    axi.patch(`/api/v1/banner/${id}`, payload),
  delete: (id) => axi.delete(`/api/v1/banner/${id}`)
}

const blogAPI = {
  create: (payload) => axi.post('/api/v1/blog', payload),
  getAll: (queryParams) => axi.get(`/api/v1/blog?${queryParams}`),
  update: (id, payload) =>
    axi.patch(`/api/v1/blog/${id}`, payload),
  delete: (id) => axi.delete(`/api/v1/blog/${id}`)
}

const statisticAPI = {
  get: (queryParams) => axi.get(`/api/v1/statistic?${queryParams}`) 
}

const userAPI = {
  login: (payload) => axi.post('/api/v1/user/login/admin', payload),
  getInfo: (token) => axi.get('/api/v1/user/info', {
    headers: {
      authorization: token
    }
  })
}

export {
 userAPI,
 blogAPI,
 orderAPI,
 imageAPI,
 bannerAPI,
 productAPI,
 partnerAPI,
 categoryAPI,
 statisticAPI,
 classificationAPI,
 seasonalCategoryAPI,
 importWarehouseOrderAPI
};

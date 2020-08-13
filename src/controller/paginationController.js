export const getPagination = (page, size) => {
    const limit = size ? +size : 10;
    const offset = page ? page * limit : 0;
    return { limit, offset };
}

export const getPagingData = (data, page, limit) => {
    const {count: productCount, rows: products } = data;
    const currentPage = page ? +page : 0;
    const totalPages = Math.ceil(productCount / limit);
    return { productCount, products, totalPages, currentPage};
}
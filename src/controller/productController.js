import { ModelProduct } from '../models/models';
import { downloadResource } from '../utils/util';

const controller = {};

controller.download = async (req, res) => {
    const fields = [
    {
        label: 'Product UUID',
        value: 'uuid'
    },
    {
        label: 'Name',
        value: 'name'
    },
    {
        label: 'Category',
        value: 'category'
    },
    {
        label: 'Description',
        value: 'description'
    },
    {
        label: 'Quantity',
        value: 'quantity'
    },
    {
        label: 'Price',
        value: 'price'
    }
    ];
    const data = await ModelProduct.findAll();

    return downloadResource(res, 'products.csv', fields, data);
}

export default controller;
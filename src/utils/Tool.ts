import * as http from 'http';
import * as fs from 'fs';
import * as path from 'path';
import * as pug from 'pug';
export { http, fs, path, pug };

export const parseQuery = ((query): { offset: number, limit: number, order: any } => {
    const { offset = 0, count = 10, sort } = query;
    const order = [];
    const columnNames = [];
    if (sort) {
        const sortColumns = sort.split(',');
        sortColumns.forEach((sortColumn) => {
            if (sortColumn.indexOf('-') === 0) {
                const actualName = sortColumn.substring(1);
                order.push([actualName, 'DESC']);
                columnNames.push(actualName);
            } else {
                columnNames.push(sortColumn);
                order.push([sortColumn, 'ASC']);
            }
        });
    }
    return { offset, limit: count, order: order.length ? order : undefined };
});

export const associateInstances = (instances: any, ...keys: string[]) => {
    let isArray = true;
    if (!(instances instanceof Array)) {
        instances = [instances];
        isArray = false;
    }
    const tasks = instances.map(async (instance) => {
        const newInstance = instance.toJSON();
        await Promise.all(
            keys.map(async (key) => {
                const lowerCaseKey = key.toLowerCase();
                const sander = await instance[`get${key}`]();
                return newInstance[lowerCaseKey] = sander;
            }));
        return newInstance;
    });
    if (isArray) {
        return Promise.all(tasks);
    }
    return tasks[0];
};

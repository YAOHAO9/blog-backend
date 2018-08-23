const Promisify = <T>(inner): Promise<T> =>
    new Promise((resolve, reject) =>
        inner((err, res) => {
            if (err) {
                reject(err);
            } else {
                resolve(res);
            }
        }),
    );

export default Promisify;



import * as finale from 'finale-rest';

import app, { sequelize } from '../server';
import User from '../models/user.model';

finale.initialize({
    app: app,
    sequelize: sequelize
});

// POST /users	        Create a user
// GET /users	        Get a listing of users
// GET /user/:id	    Get details about a user
// PUT /user/:id	    Update a user
// DELETE /user/:id	Delete a user
finale.resource({
    model: User,
    endpoints: ['/api/users', '/api/user/:id']
});
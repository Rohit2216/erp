const moment = require('moment');
require('dotenv').config();
const { con, makeDb } = require('../db');
const db = makeDb();
const { StatusCodes } = require('http-status-codes');
const Joi = require('joi');

// Schema for validating location data
const locationSchema = Joi.object({
    name: Joi.string().required(),
    latitude: Joi.number().required(),
    longitude: Joi.number().required(),
    radius: Joi.number().required(), // Added validation for radius
    assign_leave: Joi.string().optional(),
}).optional();

// CREATE: Add a new location
const addLocation = async (req, res) => {
    try {
        const { error, value } = locationSchema.validate(req.body);
        if (error) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: 'Validation error',
                details: error.details,
            });
        }
        const userId = req.user.user_id;
        

        const { name, latitude, longitude, radius, assign_leave } = value;

        const query = `
            INSERT INTO locations (name, latitude, longitude, radius, created_at, updated_at, assign_leave, created_by)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const params = [
            name,
            latitude,
            longitude,
            radius,
            moment.utc().format('YYYY-MM-DD HH:mm:ss'),
            null, // updated_at will be null initially
            assign_leave,
            userId
        ];

        const result = await db.query(query, params);

        res.status(StatusCodes.CREATED).json({
            message: 'Location added successfully',
            data: { id: result.insertId, name, latitude, longitude, radius },
        });
    } catch (err) {
        console.error('Error adding location:', err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: 'Internal server error',
        });
    }
};

// READ: Fetch all locations
const getLocations = async (req, res) => {
    try {
        const query = 'SELECT * FROM locations ORDER BY created_at DESC';
        const locations = await db.query(query);

        res.status(StatusCodes.OK).json({
            message: 'Locations retrieved successfully',
            data: locations,
        });
    } catch (err) {
        console.error('Error fetching locations:', err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: 'Internal server error',
        });
    }
};

// READ: Fetch a single location by ID
const getLocationById = async (req, res) => {
    try {
        const userId = req.user.user_id;

        const query = 'SELECT * FROM locations where created_by = ?';
        const location = await db.query(query, [userId]);

        if (location.length === 0) {
            return res.status(StatusCodes.NOT_FOUND).json({
                message: 'Location not found',
            });
        }

        res.status(StatusCodes.OK).json({
            message: 'Location retrieved successfully',
            data: location,
        });
    } catch (err) {
        console.error('Error fetching location by ID:', err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: 'Internal server error',
        });
    }
};

// UPDATE: Update a location by ID
const updateLocation = async (req, res) => {
    try {
        const { id } = req.params;
        const { error, value } = locationSchema.validate(req.body);
        if (error) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: 'Validation error',
                details: error.details,
            });
        }

        const { name, latitude, longitude, radius, assign_leave, timestamp } = value;

        const query = `
            UPDATE locations 
            SET name = ?, latitude = ?, longitude = ?, radius = ?, assign_leave = ?, updated_at = ? 
            WHERE id = ?
        `;
        const params = [
            name,
            latitude,
            longitude,
            radius,
            assign_leave,
            moment.utc().format('YYYY-MM-DD HH:mm:ss'),
            id,
        ];

        const result = await db.query(query, params);

        if (result.affectedRows === 0) {
            return res.status(StatusCodes.NOT_FOUND).json({
                message: 'Location not found or no changes made',
            });
        }

        res.status(StatusCodes.OK).json({
            message: 'Location updated successfully',
            data: { id, name, latitude, longitude, radius, timestamp },
        });
    } catch (err) {
        console.error('Error updating location:', err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: 'Internal server error',
        });
    }
};

// DELETE: Delete a location by ID
const deleteLocation = async (req, res) => {
    try {
        const { id } = req.params;

        const query = 'DELETE FROM locations WHERE id = ?';
        const result = await db.query(query, [id]);

        if (result.affectedRows === 0) {
            return res.status(StatusCodes.NOT_FOUND).json({
                message: 'Location not found',
            });
        }

        res.status(StatusCodes.OK).json({
            message: 'Location deleted successfully',
        });
    } catch (err) {
        console.error('Error deleting location:', err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: 'Internal server error',
        });
    }
};

// Export all controller methods
module.exports = {
    addLocation,
    getLocations,
    getLocationById,
    updateLocation,
    deleteLocation,
};

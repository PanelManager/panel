const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const Plan = require('../models/Plan');

router.get('/plans', async (req, res) => {
    const { egg, node } = req.query;

    const plans = await Plan.findAll({
        where: {
            eggs: {
                [Op.like]: `%${egg}%`
            },
            nodes: {
                [Op.like]: `%${node}%`
            }
        }
    });
    res.json(plans);

})

module.exports = router;
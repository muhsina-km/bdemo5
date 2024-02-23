const express = require('express');
const Wishlist = require('../model/wishlist');
const plantmodel = require('../model/planttype');
const plantdetailsmodel = require('../model/plant');
const router = express.Router();

// Add item to wishlist
router.post('/add-to-wishlist', async (req, res) => {
    const { email, plantid } = req.body;

    try {
        let wishlist = await Wishlist.findOne({ email });

        if (!wishlist) {
            wishlist = new Wishlist({
                email,
                plantids: [plantid],
            });
        } else {
            if (!wishlist.plantids.includes(plantid)) {
                wishlist.plantids.push(plantid);
            }
        }

        await wishlist.save();

        res.status(200).json({ message: 'Item added to wishlist successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// View wishlist
router.get('/view-wishlist', async (req, res) => {
    const { email } = req.query;

    try {
        const wishlist = await Wishlist.findOne({ email });

        if (!wishlist) {
            return res.status(404).json({ message: 'Wishlist not found for this user' });
        }

        // Extracting plantIds from the wishlist
        const plantIds = wishlist.plantids;
        console.log(plantIds);
        // Fetching details of plants from the Plant collection
        const plants = await plantdetailsmodel.find({ plantid: { $in: plantIds } });
        console.log(plants);
        // Merging wishlist items with plant details
        const mergedWishlist = wishlist.plantids.map(plantId => {
            const plant = plants.find(plant => plant.plantid === plantId);
            return {
                plantId: plant.plantid,
                ...plant.toObject() // Merge plant details into the wishlist item
            };
        });

        res.status(200).json({ wishlist: mergedWishlist });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Remove item from wishlist
router.delete('/remove-from-wishlist', async (req, res) => {
    const { email, plantid } = req.body;

    try {
        const wishlist = await Wishlist.findOne({ email });

        if (!wishlist) {
            return res.status(404).json({ message: 'Wishlist not found for this user' });
        }

        wishlist.plantids = wishlist.plantids.filter(id => id !== plantid);
        await wishlist.save();

        res.status(200).json({ message: 'Item removed from wishlist successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;

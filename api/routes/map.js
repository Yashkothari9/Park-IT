let express = require('express');
let db = require('./db');
let router = express.Router();

router.post('/get_live_status', async function (req, res) {
    let place_id = req.body.place_id;

    let status = await db.getRealtimeData(place_id);
    res.status(200).send(JSON.stringify(status));
});

router.post('/nearby_coordinates', async function (req, res) {
    console.log(req.body.latitude);
    console.log(req.body.longitude);
    console.log(req.body.radius);

    let latitude = req.body.latitude;
    let longitude = req.body.longitude;
    let radius = req.body.radius;

    let parkingLots = await db.getNearbyParkingLots(latitude, longitude, radius);
    console.log(parkingLots.length);
    res.status(200).send(JSON.stringify({ 'parking_lots': parkingLots }));
});


module.exports = router;
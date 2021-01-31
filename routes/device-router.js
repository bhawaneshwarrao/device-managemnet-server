const { Router } = require('express');

const router = Router();
const { v4: uuidv4 } = require('uuid');
const { logger, timeCheck } = require('../utils');
const deviceSchemaValidation = require('../middlewares/validation');
const Device = require('../model/Device');

const CHECKOUT_ALLOWED_START_TIME = process.env.checkOutAllowedStartTime || 9;
const CHECKOUT_ALLOWED_END_TIME = process.env.checkOutAllowedEndTime || 17;

// get all devices
router.get('/devices', async (req, res) => {
  try {
    const devices = await Device.find();
    res.status(200).send(devices);
  } catch (err) {
    logger.error(`err : ${err}`);
    res.status(500).send(err);
  }
});

// save device
router.post('/devices', deviceSchemaValidation(), async (req, res) => {
  try {
    const devices = await Device.find();
    if (devices.length >= 10) {
      res.status(500).send('Can not save more that 10 devices');
    } else {
      const device = req.body;
      device.id = uuidv4();
      const { id } = await Device.create(req.body);
      res.status(201).send(id);
    }
  } catch (err) {
    logger.error(`err : ${err}`);
    res.status(500).send(err);
  }
});

// update device
router.patch('/devices/:id', async (req, res) => {
  const deviceId = req.params.id;
  const device = await Device.findOne({ id: deviceId });
  if (device) {
    const { checkedOutBy, checkOut, checkIn } = req.body;
    if (checkIn && checkOut) {
      res.sendStatus(400);
      return;
    }
    if (checkOut) {
      if (timeCheck.isCheckOutAllowed(CHECKOUT_ALLOWED_START_TIME, CHECKOUT_ALLOWED_END_TIME)) {
        if (device.isCheckedOut) {
          res.status(500).send('Device already chekedOut');
        } else if (checkedOutBy) {
          const isUserCheckOutAnyDevice = await Device.findOne({
            lastCheckedOutBy: checkedOutBy,
            isCheckedOut: true,
          });
          if (isUserCheckOutAnyDevice) {
            res
              .status(403)
              .send(
                `User ${checkedOutBy} already checkedOut a device. Can not check out more than one device at a time`,
              );
          } else {
            await Device.updateOne(
              { id: deviceId },
              {
                isCheckedOut: true,
                lastCheckedOutBy: checkedOutBy,
                checkedOut_at: new Date(),
              },
            );
            res.sendStatus(204);
          }
        } else {
          res.status(400).send('checkedOutBy is required');
        }
      } else {
        res
          .status(403)
          .send(
            `checkOut allowed only in between ${CHECKOUT_ALLOWED_START_TIME} - ${CHECKOUT_ALLOWED_END_TIME}`,
          );
      }
    } else if (checkIn) {
      if (device.isCheckedOut) {
        await Device.updateOne({ id: deviceId }, { isCheckedOut: false });
      }
      res.sendStatus(204);
    } else {
      res.sendStatus(400);
    }
  } else {
    res.status(404).send('device not found');
  }
});

// delete device
router.delete('/devices/:id', async (req, res) => {
  const deviceId = req.params.id;
  if (deviceId) {
    try {
      await Device.deleteOne({ id: deviceId });
      res.status(200).send(`device ${deviceId} deleted`);
    } catch (err) {
      logger.error(`err : ${err}`);
      res.status(500).send(err);
    }
  } else {
    res.status(400).send('device id is required');
  }
});

module.exports = router;

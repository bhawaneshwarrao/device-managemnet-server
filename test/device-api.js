const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');
const Device = require('../model/Device');
const logger = require('../utils/logger');

chai.should();
chai.use(chaiHttp);

describe('Device Api', () => {
  /** Test GET route */
  describe('Get api/v1/devices', () => {
    it('Should get all devices', (done) => {
      chai
        .request(server)
        .get('/api/v1/devices')
        .end((err, response) => {
          if (err) logger.error(err);
          response.should.have.status(200);
          response.body.should.be.an('array');
          done();
        });
    });

    it('Should not have more than 10 devices', (done) => {
      chai
        .request(server)
        .get('/api/v1/devices')
        .end((err, response) => {
          if (err) logger.error(err);
          response.should.have.status(200);
          response.body.should.be.a('array');
          response.body.length.should.be.below(10);
          done();
        });
    });

    it('Should send 404 (wrong route)', (done) => {
      chai
        .request(server)
        .get('/api/v1/device')
        .end((err, response) => {
          if (err) logger.error(err);
          response.should.have.status(404);
          done();
        });
    });
  });

  /** Test POST route */
  describe('POST api/v1/devices', () => {
    const invalidDevice = {
      device: 'motG',
    };
    it('Should get 400 with error text (invalid body) ', (done) => {
      chai
        .request(server)
        .post('/api/v1/devices')
        .send(invalidDevice)
        .end((err, response) => {
          if (err) logger.error(err);
          response.should.have.status(400);
          response.text.should.be.include('is required');
          done();
        });
    });

    const validDevice = {
      device: 'motG',
      os: 'Android',
      manufacturer: 'motorola',
    };
    it('Should save device', (done) => {
      chai
        .request(server)
        .post('/api/v1/devices')
        .send(validDevice)
        .end((err, response) => {
          if (err) logger.error(err);
          response.should.have.status(201);
          done();
        });
    });
  });

  /** Test PATCH route */
  describe('PATCH api/v1/devices', () => {
    const testDevice = {
      id: 'id-for-patch-test',
      device: 'test-device',
      os: 'Android',
      manufacturer: 'motorola',
    };

    before((done) => {
      Device.create(testDevice).then(() => {
        done();
      }).catch((err) => {
        if (err) logger.error(err);
        done();
      });
    });

    const wrongDeviceId = 'should-not-be-in-database';
    it('Should get 404 with error text (wrong deviceid) ', (done) => {
      chai
        .request(server)
        .patch(`/api/v1/devices/${wrongDeviceId}`)
        .end((err, response) => {
          if (err) logger.error(err);
          response.should.have.status(404);
          response.text.should.be.eq('device not found');
          done();
        });
    });

    const wrongBody = {};
    it('Should get 400 (wrong body) ', (done) => {
      chai
        .request(server)
        .patch('/api/v1/devices/id-for-patch-test')
        .send(wrongBody)
        .end((err, response) => {
          if (err) logger.error(err);
          response.should.have.status(400);
          done();
        });
    });

    after((done) => {
      Device.deleteOne({ id: 'id-for-patch-test' }).then(() => {
        done();
      }).catch((err) => {
        if (err) logger.error(err);
        done();
      });
    });
  });

  /** Test DELETE route */
  describe('Delete api/v1/devices', () => {
    const testDevice = {
      id: 'id-for-delete-test',
      device: 'test-device',
      os: 'Android',
      manufacturer: 'motorola',
    };
    beforeEach((done) => {
      Device.create(testDevice).then(() => {
        done();
      }).catch((err) => {
        if (err) logger.error(err);
        done();
      });
    });
    it('Should get 200 response', (done) => {
      chai
        .request(server)
        .delete('/api/v1/devices/id-for-delete-test')
        .end((err, response) => {
          if (err) logger.error(err);
          response.should.have.status(200);
          done();
        });
    });
  });
});

const chai = require('chai');
const chaiHttp = require('chai-http');
const index = require('../index');
const moment = require('moment');
const mongoose = require('mongoose');
const Thread = require('../src/schemas/ThreadSchema');

chai.should();
chai.use(chaiHttp);

const datetime = moment().unix().toString();

describe('Friend', () => {
    let token = '';
    let tokenFriend = '';

    before((done) => {
        chai.request(index)
            .post('/api/register')
            .set('Content-Type', 'application/json')
            .send({
                username: "TEST",
                email: "test@test.com",
                password: "TEST!123"
            })
            .end((err, res) => {
                if (err) console.log("Error: " + err);
                if (res) {
                    console.log("The test user has been created");
                    token = res.body.token;
                }

                chai.request(index)
                    .post('/api/register')
                    .set('Content-Type', 'application/json')
                    .send({
                        username: "FRIEND",
                        email: "FRIEND@test.com",
                        password: "FRIEND!123"
                    })
                    .end((err, res) => {
                        if (err) console.log("Error: " + err);
                        if (res) {
                            console.log("The test friend has been created");
                            tokenFriend = res.body.token;
                        }
                        done();
                    });
            });
    });

    after((done) => {
        chai.request(index)
            .delete('/api/user')
            .set('X-Access-Token', token)
            .end((err, res) => {
                if (err) console.log("Error: " + err);
                if (res) {
                    console.log("The test user has been deleted");
                }

                chai.request(index)
                    .delete('/api/user')
                    .set('X-Access-Token', tokenFriend)
                    .end((err, res) => {
                        if (err) console.log("Error: " + err);
                        if (res) {
                            console.log("The test friend has been deleted");
                        }
                        done();
                    });
            });
    });

    it('should be able to create an friendship between two users', (done)=> {
        chai.request(index)
            .delete('/api/friend')
            .set('X-Access-Token', token)
            .end((err, res) => {
                if (err) console.log("Error: " + err);

                res.should.have.status(201);
                res.body.should.have.property('message', 'Thread created and save to the user');

                done();
            });


        done();
    });
});
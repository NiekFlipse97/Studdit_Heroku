const chai = require('chai');
const chaiHttp = require('chai-http');
const index = require('../index');
const moment = require('moment');
const mongoose = require('mongoose');
const Thread = require('../src/schemas/ThreadSchema');

chai.should();
chai.use(chaiHttp);

const datetime = moment().unix().toString();

// describe('Thread', () => {
//     let token = '';
//     before((done) => {
//         chai.request(index)
//             .post('/api/login')
//             .set('Content-Type', 'application/json')
//             .send({
//                 username: "Niek",
//                 password: "niek123"
//             })
//             .end((err, res) => {
//                 if (err) {
//                     console.log("Goal Error ==== " + err);
//                 }
//                 token = res.body.token;
//                 done();
//             });
//     });
//
//     it('Should create a thread with valid properties', (done) => {
//         chai.request(index)
//             .post('/api/thread')
//             .set('Content-Type', 'application/json')
//             .set('X-Access-Token', token)
//             .send({
//                 title: "Chai test for thread",
//                 content: "The content of the chai test thread"
//             })
//             .end((err, res) => {
//                 if (err) {
//                     console.log("Create thread with valid properies error ==== " + err);
//                 }
//                 res.should.have.status(201);
//                 res.body.should.have.property('message', 'Thread created and save to the user');
//                 done();
//             })
//     });
//
//     it('Should return an error message when title is not filled in', (done) => {
//         chai.request(index)
//             .post('/api/thread')
//             .set('Content-Type', 'application/json')
//             .set('X-Access-Token', token)
//             .send({
//                 title: "",
//                 content: "The content of the chai test thread"
//             })
//             .end((err, res) => {
//                 if (err) {
//                     console.log("Create thread with no title error ==== " + err);
//                 }
//                 res.should.have.status(500);
//                 res.body.should.have.property('message', 'thread validation failed: title: Thread title is required.');
//                 res.body.should.have.property('name', 'ValidationError');
//                 done();
//             })
//     });
//
//     it('Should return an error message when title is shorter than 2 characters', (done) => {
//         chai.request(index)
//             .post('/api/thread')
//             .set('Content-Type', 'application/json')
//             .set('X-Access-Token', token)
//             .send({
//                 title: "hi",
//                 content: "The content of the chai test thread"
//             })
//             .end((err, res) => {
//                 if (err) {
//                     console.log("Create thread with to short title error ==== " + err);
//                 }
//
//                 res.should.have.status(500);
//                 res.body.should.have.property('message', 'thread validation failed: title: Title must be longer than 2 characters.');
//                 res.body.should.have.property('name', 'ValidationError');
//                 done();
//             })
//     })
//
//     it('Should return an error message when content is not filled in', (done) => {
//         chai.request(index)
//             .post('/api/thread')
//             .set('Content-Type', 'application/json')
//             .set('X-Access-Token', token)
//             .send({
//                 title: "Chai test when content is not filled in",
//                 content: ""
//             })
//             .end((err, res) => {
//                 if (err) {
//                     console.log("Create thread with to short title error ==== " + err);
//                 }
//
//                 res.should.have.status(500);
//                 res.body.should.have.property('message', 'thread validation failed: content: A thread must have some content.');
//                 res.body.should.have.property('name', 'ValidationError');
//                 done();
//             })
//     });
//
//     it('Should return an error message when content is to short', (done) => {
//         chai.request(index)
//             .post('/api/thread')
//             .set('Content-Type', 'application/json')
//             .set('X-Access-Token', token)
//             .send({
//                 title: "Chai test when content is not filled in",
//                 content: "hi"
//             })
//             .end((err, res) => {
//                 if (err) {
//                     console.log("Create thread with to short title error ==== " + err);
//                 }
//
//                 res.should.have.status(500);
//                 res.body.should.have.property('message', 'thread validation failed: content: The content of the thread must be at least 2 characters long.');
//                 res.body.should.have.property('name', 'ValidationError');
//                 done();
//             })
//     })
//
//     it('Should not delete a thread when id is not valid', (done) => {
//         chai.request(index)
//             .delete('/api/thread/0')
//             .set('Content-Type', 'application/json')
//             .set('X-Access-Token', token)
//             .end((err, res) => {
//                 res.should.have.status(500);
//                 res.body.should.have.property('message', 'Cast to ObjectId failed for value \"0\" at path \"_id\" for model \"thread\"');
//                 res.body.should.have.property('name', 'CastError');
//                 done();
//             })
//     })
//
//     it('Should delete a thread when id is valid', (done) => {
//         let myThread = new Thread({
//             "title": "Test that will be deleted",
//             "content": "hiasdfasdf"
//         });
//
//         myThread.save()
//             .then(() => Thread.findOne({ title: myThread.title }))
//             .then((thread) => {
//                 chai.request(index)
//                     .delete('/api/thread/' + thread._id)
//                     .set('Content-Type', 'application/json')
//                     .set('X-Access-Token', token)
//                     .end((err, res) => {
//                         res.should.have.status(200);
//                         res.body.should.have.property('message', 'thread removed');
//                         done();
//                     })
//             })
//     })
//
//     it('Should not update the title of a thread', (done) => {
//         let myThread = new Thread({
//             "title": "Test that will be updated",
//             "content": "hiasdfasdf"
//         });
//
//         myThread.save()
//             .then(() => Thread.findOne({title: myThread.title}))
//             .then((thread) =>{
//                 chai.request(index)
//                     .put('/api/thread/' + thread._id)
//                     .set('Content-Type', 'application/json')
//                     .set('X-Access-Token', token)
//                     .send({
//                         title: "If this updates it does not work",
//                         content: "If this updates it does work"
//                     })
//                     .end((err, res) => {
//                         Thread.findOne({title: myThread.title})
//                             .then((updatedThread) => {
//                                 res.should.have.status(200);
//                                 res.body.should.have.property('message', 'The thread is updated.');
//                                 updatedThread.title.should.not.equal('If this updates it does not work');
//                                 updatedThread.title.should.equal('Test that will be updated');
//                                 done();
//                             })
//                     })
//             })
//     })
//
//     it('Should update the content of a thread', (done) => {
//         let myThread = new Thread({
//             "title": "Test that will be updated",
//             "content": "hiasdfasdf"
//         });
//
//         myThread.save()
//             .then(() => Thread.findOne({title: myThread.title}))
//             .then((thread) =>{
//                 chai.request(index)
//                     .put('/api/thread/' + thread._id)
//                     .set('Content-Type', 'application/json')
//                     .set('X-Access-Token', token)
//                     .send({
//                         title: "If this updates it does not work",
//                         content: "If this updates it does work"
//                     })
//                     .end((err, res) => {
//                         Thread.findOne({title: myThread.title})
//                             .then((updatedThread) => {
//                                 res.should.have.status(200);
//                                 res.body.should.have.property('message', 'The thread is updated.');
//                                 updatedThread.content.should.not.equal('hiasdfasdfk');
//                                 updatedThread.content.should.equal('If this updates it does work');
//                                 done();
//                             })
//                     })
//             })
//     })
//
//     after((done) => {
//         mongoose.connection.collections.threads.drop(() => {
//             done();
//         })
//     })
// })
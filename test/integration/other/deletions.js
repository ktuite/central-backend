const appPath = require('app-root-path');
const should = require('should');
const { sql } = require('slonik');
const { testService } = require('../setup');
const testData = require('../../data/xml');
const { Blob, Form } = require(appPath + '/lib/model/frames');

const withSimpleIds = (deprecatedId, instanceId) => testData.instances.simple.one
  .replace('one</instance', `${instanceId}</instanceID><deprecatedID>${deprecatedId}</deprecated`);

describe.only('query module submission deletion', () => {
  it('should delete the submission and not be able to get it again', testService((service, container) =>
    service.login('alice', (asAlice) =>
      asAlice.post('/v1/projects/1/forms/simple/submissions')
        .send(testData.instances.simple.one)
        .set('Content-Type', 'application/xml')
        .expect(200)
        .then(() => asAlice.get('/v1/projects/1/forms/simple/submissions/one')
          .expect(200))
        .then(() => Promise.all([
          container.Forms.getByProjectAndXmlFormId(1, 'simple').then((o) => o.get()),
          container.Submissions.getByIds(1, 'simple', 'one', false).then((o) => o.get()),
          container.Users.getByEmail('alice@opendatakit.org').then((o) => o.get())
        ]))
        .then(([ form, submission, alice ]) => container.Submissions.realDelete(submission, form, alice))
        .then(() => asAlice.get('/v1/projects/1/forms/simple/submissions/one')
          .expect(404)))));

  it('should log in audits that the submission was deleted', testService((service, container) =>
    service.login('alice', (asAlice) =>
      asAlice.post('/v1/projects/1/forms/simple/submissions')
        .send(testData.instances.simple.one)
        .set('Content-Type', 'application/xml')
        .expect(200)
        .then(() => Promise.all([
          container.Forms.getByProjectAndXmlFormId(1, 'simple').then((o) => o.get()),
          container.Submissions.getByIds(1, 'simple', 'one', false).then((o) => o.get()),
          container.Users.getByEmail('alice@opendatakit.org').then((o) => o.get())
        ]))
        .then(([ form, submission, user ]) => container.Submissions.realDelete(submission, form, user))
        .then(() => Promise.all([
          container.Audits.getLatestByAction('submission.delete'), // TODO: different action?
          container.Forms.getByProjectAndXmlFormId(1, 'simple').then((o) => o.get()),
          container.Users.getByEmail('alice@opendatakit.org').then((o) => o.get())
        ])
        .then(([ audit, form, alice ]) => {
          audit.isDefined().should.equal(true);
          audit.get().actorId.should.equal(alice.actor.id);
          audit.get().details.instanceId.should.equal('one');
          audit.get().acteeId.should.equal(form.acteeId); // TODO: probably the submission instance id somehow
        })))));

  it('should delete all defs of a submission', testService((service, container) =>
    service.login('alice', (asAlice) =>
      asAlice.post('/v1/projects/1/forms/simple/submissions')
        .send(testData.instances.simple.one)
        .set('Content-Type', 'application/xml')
        .expect(200)
        .then(() => asAlice.put('/v1/projects/1/forms/simple/submissions/one')
          .send(withSimpleIds('one', 'two'))
          .set('Content-Type', 'text/xml')
          .expect(200))
        .then(() => container.oneFirst(sql`select count(*) from submission_defs`)
          .then((count) => { count.should.equal(2); }))
        .then(() => Promise.all([
          container.Forms.getByProjectAndXmlFormId(1, 'simple').then((o) => o.get()),
          container.Submissions.getByIds(1, 'simple', 'one', false).then((o) => o.get()),
          container.Users.getByEmail('alice@opendatakit.org').then((o) => o.get())
        ]))
        .then(([ form, submission, user ]) => container.Submissions.realDelete(submission, form, user))
        .then(() => container.oneFirst(sql`select count(*) from submission_defs`)
          .then((count) => { count.should.equal(0); })))));

  it('should delete attachments associated with the submission', testService((service, container) =>
    service.login('alice', (asAlice) =>
      asAlice.post('/v1/projects/1/forms?publish=true')
        .set('Content-Type', 'application/xml')
        .send(testData.forms.binaryType)
        .expect(200)
        .then(() => asAlice.post('/v1/projects/1/submission')
          .set('X-OpenRosa-Version', '1.0')
          .attach('xml_submission_file', Buffer.from(testData.instances.binaryType.both), { filename: 'data.xml' })
          .attach('here_is_file2.jpg', Buffer.from('this is test file two'), { filename: 'here_is_file2.jpg' })
          .attach('my_file1.mp4', Buffer.from('this is test file one'), { filename: 'my_file1.mp4' })
          .expect(201))
        .then(() => asAlice.get('/v1/projects/1/forms/binaryType/submissions/both/attachments')
          .expect(200)
          .then(({ body }) => {
            body.should.eql([
              { name: 'here_is_file2.jpg', exists: true },
              { name: 'my_file1.mp4', exists: true }
            ]);
          }))
        .then(() => Promise.all([
          container.Forms.getByProjectAndXmlFormId(1, 'binaryType').then((o) => o.get()),
          container.Submissions.getByIds(1, 'binaryType', 'both', false).then((o) => o.get()),
          container.Users.getByEmail('alice@opendatakit.org').then((o) => o.get())
        ]))
        .then(([ form, submission, user ]) => container.Submissions.realDelete(submission, form, user))
        .then(() => container.oneFirst(sql`select count(*) from submission_attachments`)
          .then((count) => { count.should.equal(0); }))
        .then(() => container.oneFirst(sql`select count(*) from blobs`)
          .then((count) => { count.should.equal(0); }))
        .then(() => asAlice.get('/v1/projects/1/forms/binaryType/submissions/both/attachments')
          .expect(404)))));

  it('should delete submission comments from comments table', testService((service, container) =>
    service.login('alice', (asAlice) =>
      asAlice.post('/v1/projects/1/forms/simple/submissions')
        .send(testData.instances.simple.one)
        .set('Content-Type', 'application/xml')
        .expect(200)
        .then(() => asAlice.post('/v1/projects/1/forms/simple/submissions/one/comments')
          .send({ body: 'new comment here' })
          .expect(200))
        .then(() => container.oneFirst(sql`select count(*) from comments`)
          .then((count) => { count.should.equal(1); }))
        .then(() => Promise.all([
          container.Forms.getByProjectAndXmlFormId(1, 'simple').then((o) => o.get()),
          container.Submissions.getByIds(1, 'simple', 'one', false).then((o) => o.get()),
          container.Users.getByEmail('alice@opendatakit.org').then((o) => o.get())
        ]))
        .then(([ form, submission, user ]) => container.Submissions.realDelete(submission, form, user))
        .then(() => container.oneFirst(sql`select count(*) from comments`)
          .then((count) => { count.should.equal(0); })))));

  it('should delete submission comments from notes fields of audits table', testService((service, container) =>
    service.login('alice', (asAlice) =>
      asAlice.post('/v1/projects/1/forms/simple/submissions')
        .send(testData.instances.simple.one)
        .set('Content-Type', 'application/xml')
        .expect(200)
        .then(() => asAlice.patch('/v1/projects/1/forms/simple/submissions/one')
          .send({ reviewState: 'approved' })
          .set('X-Action-Notes', 'secret note')
          .expect(200))
        .then(() => container.Audits.getLatestByAction('submission.update')
          .then((audit) => { audit.get().notes.should.equal('secret note'); }))
        .then(() => Promise.all([
          container.Forms.getByProjectAndXmlFormId(1, 'simple').then((o) => o.get()),
          container.Submissions.getByIds(1, 'simple', 'one', false).then((o) => o.get()),
          container.Users.getByEmail('alice@opendatakit.org').then((o) => o.get())
        ]))
        .then(([ form, submission, user ]) => container.Submissions.realDelete(submission, form, user))
        .then(() => container.Audits.getLatestByAction('submission.update')
          .then((audit) => { audit.get().notes.should.equal(''); })))));
});
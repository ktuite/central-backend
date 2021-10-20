//// Inside lib/resources/submissions.js around line 208

    service.delete(`${base}/submissions/:instanceId`, endpoint(({ Forms, Submissions }, { params, auth }) => {
      console.log("inside the delete resource");
      return getForm(params, Forms)
        .then((form) => auth.canOrReject('submission.update', form))
        .then((form) => Submissions.getByIds(params.projectId, params.formId, params.instanceId, draft)
          .then(getOrNotFound)
          .then((submission) => {
            console.log("got the submission by id", submission);
            return Submissions.realDelete(submission, form)
              .then((res) => {
                console.log("*** DB query module Real Delete SQL response:", res);
                return success;
              });
          }));
      }));



/// inside test/integration/api/submissions.js

  // TODO: delete these delete tests
  describe('/:instanceId DELETE', () => {
    it('should reject notfound if the submission does not exist', testService((service) =>
      service.login('alice', (asAlice) =>
        asAlice.delete('/v1/projects/1/forms/simple/submissions/one')
          .expect(404))));

    it('should reject if the user does not have permission to delete', testService((service) =>
      service.login('alice', (asAlice) =>
        asAlice.post('/v1/projects/1/forms/simple/submissions')
          .send(testData.instances.simple.one)
          .set('Content-Type', 'application/xml')
          .expect(200)
          .then(() => service.login('chelsea', (asChelsea) =>
            asChelsea.delete('/v1/projects/1/forms/simple/submissions/one')
              .expect(403))))));

    it('should delete the submission and not be able to get it again', testService((service) =>
      service.login('alice', (asAlice) =>
        asAlice.post('/v1/projects/1/forms/simple/submissions')
          .send(testData.instances.simple.one)
          .set('Content-Type', 'application/xml')
          .expect(200)
          .then(() => asAlice.delete('/v1/projects/1/forms/simple/submissions/one')
            .expect(200))
          .then(() => asAlice.get('/v1/projects/1/forms/simple/submissions/one')
            .expect(404)))));

    it('should log in audits that the submission was deleted', testService((service, { Audits, Forms, Users }) =>
      service.login('alice', (asAlice) =>
        asAlice.post('/v1/projects/1/forms/simple/submissions')
          .send(testData.instances.simple.one)
          .set('Content-Type', 'application/xml')
          .expect(200)
          .then(() => asAlice.delete('/v1/projects/1/forms/simple/submissions/one')
            .expect(200))
          .then(() => Promise.all([
            Audits.getLatestByAction('submission.delete'), // TODO: different action?
            Forms.getByProjectAndXmlFormId(1, 'simple').then((o) => o.get()),
            Users.getByEmail('alice@opendatakit.org').then((o) => o.get())
          ])
          .then(([ audit, form, alice ]) => {
            console.log("test, audit:", audit);
            audit.isDefined().should.equal(true);
            audit.get().actorId.should.equal(alice.actor.id);
            audit.get().details.should.eql({ instanceId: 'one', submissionId: 1 });
            audit.get().acteeId.should.equal(form.acteeId); // TODO: probably the submission instance id somehow
          })))));

    it('should delete all defs of a submission', testService((service, { Audits, oneFirst }) =>
      service.login('alice', (asAlice) =>
        asAlice.post('/v1/projects/1/forms/simple/submissions')
          .send(testData.instances.simple.one)
          .set('Content-Type', 'application/xml')
          .expect(200)
          .then(() => asAlice.put('/v1/projects/1/forms/simple/submissions/one')
            .send(withSimpleIds('one', 'two'))
            .set('Content-Type', 'text/xml')
            .expect(200))
          .then(() => oneFirst(sql`select count(*) from submission_defs`)
            .then((count) => { count.should.equal(2); }))
          .then(() => asAlice.delete('/v1/projects/1/forms/simple/submissions/one')
            .expect(200))
          .then(() => oneFirst(sql`select count(*) from submission_defs`)
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
          .then(() => asAlice.delete('/v1/projects/1/forms/binaryType/submissions/both')
            .expect(200))
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
          .then(() => asAlice.delete('/v1/projects/1/forms/simple/submissions/one')
            .expect(200))
          .then(() => container.oneFirst(sql`select count(*) from comments`)
            .then((count) => { count.should.equal(0); })))));

    it('should delete submission comments from notes fields of audits table', testService((service, { Audits }) =>
      service.login('alice', (asAlice) =>
        asAlice.post('/v1/projects/1/forms/simple/submissions')
          .send(testData.instances.simple.one)
          .set('Content-Type', 'application/xml')
          .expect(200)
          .then(() => asAlice.patch('/v1/projects/1/forms/simple/submissions/one')
            .send({ reviewState: 'approved' })
            .set('X-Action-Notes', 'secret note')
            .expect(200))
          .then(() => Audits.getLatestByAction('submission.update')
            .then((audit) => { audit.get().notes.should.equal('secret note'); }))
          .then(() => asAlice.delete('/v1/projects/1/forms/simple/submissions/one')
            .expect(200))
          .then(() => Audits.getLatestByAction('submission.update')
            .then((audit) => { audit.get().notes.should.equal(''); })))));
  });
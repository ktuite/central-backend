
const { rowsToInstances } = require('../../util/db');
const Option = require('../../reused/option');

// shared fragment which takes the target actor id and any relevant actor system
// ids and recursively resolves all group memberships into a seq of actor ids.
// NOTE: this is a template string so it can be multiline. **DO NOT** under ANY
// CIRCUMSTANCES actually template variables into it! doing so would allow sql
// injection attacks. use ? substitution instead.
const impliedActors =
  `"actorId" in (with recursive implied_actors(id) as (
    (select ?::int) union all
    (select id from actors where "systemId" = any(?)) union all
    (select "parentActorId" as id from implied_actors a, memberships m
      where a.id = m."childActorId")
  ) select id from implied_actors)`;

module.exports = {
  grant: (actorId, verb, acteeId) => ({ simply, Grant }) =>
    simply.create('grants', new Grant({ actorId, verb, acteeId })),

  // Defensively takes either Actor or Option[Actor].
  getByTriple: (actor, verb, actee) => ({ db, Grant }) => {
    const maybeActor = Option.of(actor);

    const actorId = maybeActor.map((someActor) => someActor.id).orNull();
    const systemIds = [ '*' ].concat(maybeActor.map(() => [ 'authed' ]).orElse([]));

    return db.select('*').from('grants')
      .whereRaw(impliedActors, [ actorId, systemIds ])
      .whereIn('verb', [ '*', verb ])
      .whereIn('acteeId', actee.acteeIds())
      .then(rowsToInstances(Grant));
  }
};

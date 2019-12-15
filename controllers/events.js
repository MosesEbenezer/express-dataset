//jshint esversion:8
const getAllEvents = async (req, res) => {
	const events = await Event.findAll({
    attributes: {
      exclude: ['createdAt', 'updatedAt', 'actorId', 'repoId'],
    },
    include: [
      {
        model: Actor,
        attributes: ['id', 'login', 'avatar_url'],
      },
      {
        model: Repo,
        attributes: ['id', 'name', 'url'],
      },
    ],
    order: [['id']],
  });
  return res.status(200).send(events);
};

//on addEvent
const createEvent = async (event) => {
  const {
    id, type, actor, repo, created_at,
  } = event;
  await Event.create({
    id,
    type,
    created_at,
    actorId: actor.id,
    repoId: repo.id,
  });
};

const createActor = async (actor) => {
  const { id, login, avatar_url } = actor;
  await Actor.create({
    id,
    login,
    avatar_url,
  });
};

const createRepo = async (repo) => {
  const { id, name, url } = repo;
  await Repo.create({
    id,
    name,
    url,
  });
};

const addEvent = async (req, res, next) => {
	// basic same id check, if present return 400
  // else insert
  const {
    id, actor, repo,
  } = req.body;
  const [actorInDB, eventInDB, repoInDB] = await Promise.all([
    Actor.findByPk(actor.id),
    Event.findByPk(id),
    Repo.findByPk(repo.id),
  ]);
  if (eventInDB) {
    return res.status(400).send({});
  }
  // check this event
  if (!actorInDB) {
    await createActor(actor);
  }
  if (!repoInDB) {
    await createRepo(repo);
  }
  await createEvent(req.body);
  return res.status(201).send({});
};


const getByActor = async (req, res) => {
	// 404 if actor does not exist
  // return all the events
  const { id } = req.params;
  const events = await Event.findAll({
    where: {
      actorId: id,
    },
    attributes: {
      exclude: ['createdAt', 'updatedAt', 'actorId', 'repoId'],
    },
    include: [
      {
        model: Actor,
        attributes: ['id', 'login', 'avatar_url'],
      },
      {
        model: Repo,
        attributes: ['id', 'name', 'url'],
      },
    ],
    order: [['id']],
  });
  return res.status(200).send(events);
};


var eraseEvents = async (req, res) => {
	// await Event.destroy({
  //   where: {},
  //   // i think truncate would be fine?
  //   // removes the memory allocation
  //   truncate: true,
  // });
  await Promise.all([
    Event.destroy({
      where: {},
      truncate: true,
    }),
    Actor.destroy({
      where: {},
      truncate: true,
    }),
    Repo.destroy({
      where: {},
      truncate: true,
    }),
  ]);

  return res.status(200).send({});
};

module.exports = {
	getAllEvents: getAllEvents,
	addEvent: addEvent,
	getByActor: getByActor,
	eraseEvents: eraseEvents
};

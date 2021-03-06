//-----------------------------------------------------------------------------
// Requirements
//-----------------------------------------------------------------------------

var redis = require('redis')
  , _ = require('underscore')
  , tracker = require('./tracker')
  , reporter = require('./reporter')
  , methods = _.extend(tracker, reporter)
  , clients = {};

//-----------------------------------------------------------------------------
// Public
//-----------------------------------------------------------------------------

/**
 * Creates an active-user client, backed by Redis.
 *
 * @param {Number} port The port the Redis server is running on.
 * @param {String} host The hostname the Redis server is running on.
 * @param {Object} options Options to pass to the Redis client.
 * @returns {Object} An active-user client object.
 */
function createClient(port, host, options) {
  options = options || {};
  options = _.extend(options, { return_buffers: true });
  client = redis.createClient(port, host, options);

  var activity = {};
  _.each(methods, function (fn, name) {
    activity[name] = _.partial(fn, client);
  });

  activity.client = client;
  return activity;
}

//-----------------------------------------------------------------------------
// Exports
//-----------------------------------------------------------------------------

exports.createClient = createClient;

